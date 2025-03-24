import numpy as np
import tensorflow as tf
from typing import Dict, List, Tuple
from src.core.network_slice import QoSRequirements

class ResourcePredictor:
    def __init__(self, model_path: str = None):
        self.model = self._build_model() if not model_path else self._load_model(model_path)
        self.scaler = None  # Will be initialized during training
        self.history: List[Dict] = []  # Store historical predictions and actual usage

    def _build_model(self) -> tf.keras.Model:
        """
        Build the neural network model for resource prediction.
        
        Returns:
            tf.keras.Model: Compiled TensorFlow model
        """
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(6,)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dropout(0.1),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dense(3, activation='linear')  # Predict CPU, memory, and bandwidth
        ])

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )

        return model

    def _load_model(self, model_path: str) -> tf.keras.Model:
        """
        Load a pre-trained model from disk.
        
        Args:
            model_path: Path to the saved model
        
        Returns:
            tf.keras.Model: Loaded TensorFlow model
        """
        return tf.keras.models.load_model(model_path)

    def preprocess_input(
        self,
        qos_requirements: QoSRequirements,
        service_type: str,
        current_load: Dict[str, float]
    ) -> np.ndarray:
        """
        Preprocess input data for the model.
        
        Args:
            qos_requirements: QoS requirements
            service_type: Type of service
            current_load: Current system load
        
        Returns:
            np.ndarray: Preprocessed input features
        """
        # Convert service type to one-hot encoding
        service_type_encoding = {
            "eMBB": [1, 0, 0],
            "URLLC": [0, 1, 0],
            "mMTC": [0, 0, 1]
        }
        
        features = [
            qos_requirements.latency_ms,
            qos_requirements.bandwidth_mbps,
            qos_requirements.reliability
        ] + service_type_encoding.get(service_type, [0, 0, 0])

        return np.array(features).reshape(1, -1)

    def predict_resources(
        self,
        qos_requirements: QoSRequirements,
        service_type: str,
        current_load: Dict[str, float]
    ) -> Dict[str, float]:
        """
        Predict required resources based on QoS requirements and current system state.
        
        Args:
            qos_requirements: QoS requirements
            service_type: Type of service
            current_load: Current system load
        
        Returns:
            Dict[str, float]: Predicted resource requirements
        """
        input_features = self.preprocess_input(qos_requirements, service_type, current_load)
        predictions = self.model.predict(input_features)[0]
        
        return {
            "cpu": max(0.0, predictions[0]),
            "memory": max(0.0, predictions[1]),
            "bandwidth": max(0.0, predictions[2])
        }

    def train(
        self,
        training_data: List[Tuple[Dict, Dict]],
        validation_split: float = 0.2,
        epochs: int = 100,
        batch_size: int = 32
    ) -> None:
        """
        Train the model on historical data.
        
        Args:
            training_data: List of (input_features, actual_resources) pairs
            validation_split: Fraction of data to use for validation
            epochs: Number of training epochs
            batch_size: Batch size for training
        """
        # Prepare training data
        X = np.array([self.preprocess_input(**d[0])[0] for d in training_data])
        y = np.array([[d[1]["cpu"], d[1]["memory"], d[1]["bandwidth"]] for d in training_data])

        # Train the model
        self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(
                    patience=10,
                    restore_best_weights=True
                )
            ]
        )

    def update_history(
        self,
        prediction: Dict[str, float],
        actual_usage: Dict[str, float],
        qos_requirements: QoSRequirements,
        service_type: str
    ) -> None:
        """
        Update historical data with prediction results.
        
        Args:
            prediction: Predicted resource requirements
            actual_usage: Actual resource usage
            qos_requirements: QoS requirements
            service_type: Type of service
        """
        self.history.append({
            "prediction": prediction,
            "actual": actual_usage,
            "qos_requirements": qos_requirements,
            "service_type": service_type,
            "error": {
                k: abs(prediction[k] - actual_usage[k])
                for k in prediction.keys()
            }
        })

    def get_prediction_accuracy(self) -> Dict[str, float]:
        """
        Calculate prediction accuracy metrics.
        
        Returns:
            Dict[str, float]: Accuracy metrics for each resource type
        """
        if not self.history:
            return {}

        errors = {
            "cpu": [],
            "memory": [],
            "bandwidth": []
        }

        for entry in self.history:
            for resource_type in errors.keys():
                error = entry["error"][resource_type]
                actual = entry["actual"][resource_type]
                relative_error = (error / actual) * 100 if actual > 0 else 0
                errors[resource_type].append(relative_error)

        return {
            f"{k}_mean_error": np.mean(v)
            for k, v in errors.items()
        }

    def save_model(self, model_path: str) -> None:
        """
        Save the trained model to disk.
        
        Args:
            model_path: Path to save the model
        """
        self.model.save(model_path) 