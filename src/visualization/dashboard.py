import dash
from dash import html, dcc
from dash.dependencies import Input, Output
import plotly.graph_objs as go
import plotly.express as px
import pandas as pd
import networkx as nx
from typing import Dict, List
import requests
import json

# Initialize the Dash app
app = dash.Dash(__name__, suppress_callback_exceptions=True)
server = app.server  # Expose Flask server for WSGI

# API endpoint
API_BASE_URL = "http://localhost:8000/api/v1"

def get_api_data(endpoint: str) -> Dict:
    """Fetch data from the API."""
    try:
        response = requests.get(f"{API_BASE_URL}/{endpoint}")
        return response.json()
    except:
        return {}

def create_network_topology_figure(topology_data: Dict) -> go.Figure:
    """Create a network topology visualization."""
    G = nx.Graph(topology_data)
    pos = nx.spring_layout(G)
    
    edge_trace = go.Scatter(
        x=[],
        y=[],
        line=dict(width=0.5, color='#888'),
        hoverinfo='none',
        mode='lines'
    )

    for edge in G.edges():
        x0, y0 = pos[edge[0]]
        x1, y1 = pos[edge[1]]
        edge_trace['x'] += (x0, x1, None)
        edge_trace['y'] += (y0, y1, None)

    node_trace = go.Scatter(
        x=[pos[node][0] for node in G.nodes()],
        y=[pos[node][1] for node in G.nodes()],
        mode='markers+text',
        hoverinfo='text',
        text=list(G.nodes()),
        marker=dict(
            size=20,
            color='lightblue',
            line=dict(width=2)
        )
    )

    return go.Figure(
        data=[edge_trace, node_trace],
        layout=go.Layout(
            title='Network Topology',
            showlegend=False,
            hovermode='closest',
            margin=dict(b=20,l=5,r=5,t=40),
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)
        )
    )

# Define the layout
app.layout = html.Div([
    html.H1('Network Slicing Dashboard'),
    
    html.Div([
        html.Div([
            html.H3('Active Network Slices'),
            dcc.Graph(id='slice-status-graph'),
            dcc.Interval(
                id='slice-status-interval',
                interval=5000  # Update every 5 seconds
            )
        ], className='six columns'),
        
        html.Div([
            html.H3('Resource Utilization'),
            dcc.Graph(id='resource-utilization-graph'),
            dcc.Interval(
                id='resource-interval',
                interval=5000
            )
        ], className='six columns')
    ], className='row'),
    
    html.Div([
        html.Div([
            html.H3('Network Topology'),
            dcc.Graph(id='network-topology'),
            dcc.Interval(
                id='topology-interval',
                interval=10000
            )
        ], className='twelve columns')
    ], className='row'),
    
    html.Div([
        html.Div([
            html.H3('VNF Instances'),
            dcc.Graph(id='vnf-status-graph'),
            dcc.Interval(
                id='vnf-interval',
                interval=5000
            )
        ], className='six columns'),
        
        html.Div([
            html.H3('Resource Prediction Accuracy'),
            dcc.Graph(id='prediction-accuracy-graph'),
            dcc.Interval(
                id='prediction-interval',
                interval=10000
            )
        ], className='six columns')
    ], className='row')
])

@app.callback(
    Output('slice-status-graph', 'figure'),
    Input('slice-status-interval', 'n_intervals')
)
def update_slice_status(n):
    """Update the slice status visualization."""
    slices = get_api_data('slices')
    
    if not slices:
        return go.Figure()

    df = pd.DataFrame(slices['slices'])
    
    fig = px.bar(
        df,
        x='name',
        y='performance_metrics.resource_utilization',
        color='service_type',
        title='Slice Resource Utilization'
    )
    
    return fig

@app.callback(
    Output('resource-utilization-graph', 'figure'),
    Input('resource-interval', 'n_intervals')
)
def update_resource_utilization(n):
    """Update the resource utilization visualization."""
    slices = get_api_data('slices')
    
    if not slices:
        return go.Figure()

    resources = {
        'CPU': [],
        'Memory': [],
        'Bandwidth': []
    }
    
    for slice_data in slices['slices']:
        metrics = slice_data['performance_metrics']
        resources['CPU'].append(metrics['current_bandwidth'])
        resources['Memory'].append(metrics['current_latency'])
        resources['Bandwidth'].append(metrics['reliability_score'])

    fig = go.Figure()
    
    for resource, values in resources.items():
        fig.add_trace(go.Box(
            y=values,
            name=resource,
            boxpoints='all'
        ))
    
    fig.update_layout(title='Resource Utilization Distribution')
    return fig

@app.callback(
    Output('network-topology', 'figure'),
    Input('topology-interval', 'n_intervals')
)
def update_topology(n):
    """Update the network topology visualization."""
    # In a real implementation, this would fetch topology data from the SDN controller
    topology_data = {
        'nodes': ['node1', 'node2', 'node3', 'node4'],
        'edges': [('node1', 'node2'), ('node2', 'node3'), ('node3', 'node4'), ('node4', 'node1')]
    }
    
    return create_network_topology_figure(topology_data)

@app.callback(
    Output('vnf-status-graph', 'figure'),
    Input('vnf-interval', 'n_intervals')
)
def update_vnf_status(n):
    """Update the VNF status visualization."""
    vnfs = get_api_data('vnf/instances')
    
    if not vnfs:
        return go.Figure()

    df = pd.DataFrame(vnfs['vnfs'])
    
    fig = px.scatter(
        df,
        x='type',
        y='status',
        color='network',
        title='VNF Instance Status'
    )
    
    return fig

@app.callback(
    Output('prediction-accuracy-graph', 'figure'),
    Input('prediction-interval', 'n_intervals')
)
def update_prediction_accuracy(n):
    """Update the prediction accuracy visualization."""
    metrics = get_api_data('metrics/resource-prediction')
    
    if not metrics:
        return go.Figure()

    df = pd.DataFrame({
        'Resource': list(metrics.keys()),
        'Error (%)': list(metrics.values())
    })
    
    fig = px.bar(
        df,
        x='Resource',
        y='Error (%)',
        title='Resource Prediction Error'
    )
    
    return fig

def main():
    """Run the dashboard server."""
    print("Starting dashboard at http://localhost:8050")
    app.run_server(debug=False, host='0.0.0.0', port=8050)

if __name__ == '__main__':
    main() 