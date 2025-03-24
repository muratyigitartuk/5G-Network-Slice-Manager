# Component Documentation

This document provides detailed information about the components used in the Network Slicing Management Platform.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
  - [MainLayout](#mainlayout)
  - [Dashboard](#dashboard)
  - [SliceManager](#slicemanager)
  - [Analytics](#analytics)
  - [Compliance](#compliance)
  - [Settings](#settings)
- [Utility Components](#utility-components)
  - [CardWithLoading](#cardwithloading)
  - [ErrorBoundary](#errorboundary)
  - [SkipLink](#skiplink)
  - [SkillsShowcase](#skillsshowcase)
- [Custom Hooks](#custom-hooks)
  - [useDataFetching](#usedatafetching)
  - [useForm](#useform)
- [Context Providers](#context-providers)
  - [NotificationContext](#notificationcontext)

## Overview

The Network Slicing Management Platform is built using a component-based architecture with React. Components are organized into categories based on their functionality and purpose.

## Core Components

### MainLayout

The `MainLayout` component provides the main layout structure for the application, including the sidebar, header, and content area.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to render in the main content area |

**Usage:**

```jsx
import MainLayout from '../components/Layout/MainLayout';

const MyPage = () => {
  return (
    <MainLayout>
      <h1>My Page Content</h1>
    </MainLayout>
  );
};
```

### Dashboard

The `Dashboard` component displays an overview of the network slicing platform, including key performance indicators, active slices, and recent activity.

**Props:**

None

**Usage:**

```jsx
import Dashboard from '../components/Dashboard/Dashboard';

const DashboardPage = () => {
  return <Dashboard />;
};
```

### SliceManager

The `SliceManager` component provides an interface for managing network slices, including creating, editing, and deleting slices.

**Props:**

None

**Usage:**

```jsx
import SliceManager from '../components/SliceManager/SliceManager';

const SliceManagerPage = () => {
  return <SliceManager />;
};
```

### Analytics

The `Analytics` component provides visualizations and analytics for network slice performance and system metrics.

**Props:**

None

**Usage:**

```jsx
import Analytics from '../components/Analytics/Analytics';

const AnalyticsPage = () => {
  return <Analytics />;
};
```

### Compliance

The `Compliance` component provides tools for monitoring and managing compliance with regulatory requirements.

**Props:**

None

**Usage:**

```jsx
import Compliance from '../components/Compliance/Compliance';

const CompliancePage = () => {
  return <Compliance />;
};
```

### Settings

The `Settings` component provides an interface for managing user settings and preferences.

**Props:**

None

**Usage:**

```jsx
import Settings from '../components/Settings/Settings';

const SettingsPage = () => {
  return <Settings />;
};
```

## Utility Components

### CardWithLoading

The `CardWithLoading` component provides a standardized card layout with loading, error, and empty states.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | The title of the card |
| loading | boolean | false | Whether the card is in a loading state |
| error | string | null | Error message to display if there is an error |
| isEmpty | boolean | false | Whether the card has no content to display |
| emptyMessage | string | 'No data available' | Message to display when isEmpty is true |
| onRetry | function | null | Function to call when the retry button is clicked in the error state |
| collapsible | boolean | false | Whether the card can be collapsed |
| footerActions | ReactNode | null | Actions to display in the card footer |
| children | ReactNode | - | The content to render in the card |

**Usage:**

```jsx
import CardWithLoading from '../components/Utils/CardWithLoading';

const MyComponent = () => {
  const { data, loading, error, refetch } = useDataFetching('/api/data');
  
  return (
    <CardWithLoading
      title="My Card"
      loading={loading}
      error={error}
      onRetry={refetch}
      isEmpty={data.length === 0}
      emptyMessage="No data available"
      collapsible
      footerActions={<Button>View All</Button>}
    >
      {/* Card content */}
    </CardWithLoading>
  );
};
```

### ErrorBoundary

The `ErrorBoundary` component catches JavaScript errors in its child component tree and displays a fallback UI.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The components that the error boundary should wrap |
| fallback | ReactNode | null | Custom fallback UI to display when an error occurs |
| resetErrorBoundary | function | null | Function to reset the error boundary state |

**Usage:**

```jsx
import ErrorBoundary from '../components/Utils/ErrorBoundary';

const MyComponent = () => {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      resetErrorBoundary={() => {
        // Reset the error boundary state
      }}
    >
      <ComponentThatMightError />
    </ErrorBoundary>
  );
};
```

### SkipLink

The `SkipLink` component provides a keyboard-accessible link that allows users to skip to the main content of the page.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| targetId | string | - | The ID of the element to skip to |
| text | string | 'Skip to main content' | The text to display in the skip link |

**Usage:**

```jsx
import SkipLink from '../components/Utils/SkipLink';

const MyComponent = () => {
  return (
    <>
      <SkipLink targetId="main-content" />
      <header>...</header>
      <main id="main-content">
        {/* Main content */}
      </main>
    </>
  );
};
```

### SkillsShowcase

The `SkillsShowcase` component demonstrates advanced React techniques and features.

**Props:**

None

**Usage:**

```jsx
import SkillsShowcase from '../components/SkillsShowcase/SkillsShowcase';

const SkillsShowcasePage = () => {
  return <SkillsShowcase />;
};
```

## Custom Hooks

### useDataFetching

The `useDataFetching` hook provides a standardized way to fetch data from an API, with loading, error, and success states.

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| url | string | - | The URL to fetch data from |
| options | object | {} | Options for the fetch request |
| options.method | string | 'GET' | The HTTP method to use |
| options.headers | object | {} | Headers to include in the request |
| options.body | any | null | Body to include in the request |
| options.transformData | function | null | Function to transform the response data |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| data | any | The fetched data |
| loading | boolean | Whether the data is currently being fetched |
| error | string | Error message if the fetch failed |
| refetch | function | Function to refetch the data |

**Usage:**

```jsx
import useDataFetching from '../components/Utils/useDataFetching';

const MyComponent = () => {
  const { data, loading, error, refetch } = useDataFetching('/api/data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    transformData: (data) => data.map(item => ({ ...item, processed: true })),
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

### useForm

The `useForm` hook provides form state management and validation.

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| initialValues | object | {} | Initial values for the form fields |
| validationRules | object | {} | Validation rules for the form fields |
| onSubmit | function | null | Function to call when the form is submitted |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| values | object | Current values of the form fields |
| errors | object | Validation errors for the form fields |
| touched | object | Whether each field has been touched |
| handleChange | function | Function to handle input changes |
| handleBlur | function | Function to handle input blur events |
| handleSubmit | function | Function to handle form submission |
| resetForm | function | Function to reset the form to its initial state |
| setValues | function | Function to set the form values |
| validateAll | function | Function to validate all form fields |
| isValid | boolean | Whether the form is valid |

**Usage:**

```jsx
import useForm from '../components/Utils/useForm';
import { required, email, minLength } from '../components/Utils/formValidation';

const MyForm = () => {
  const validationRules = {
    name: [required('Name is required')],
    email: [required('Email is required'), email('Invalid email format')],
    password: [required('Password is required'), minLength(8, 'Password must be at least 8 characters')],
  };
  
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = useForm(
    { name: '', email: '', password: '' },
    validationRules,
    (formValues) => {
      console.log('Form submitted:', formValues);
    }
  );
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.name && errors.name && (
          <div className="error">{errors.name}</div>
        )}
      </div>
      
      {/* Similar fields for email and password */}
      
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
```

## Context Providers

### NotificationContext

The `NotificationContext` provides a system for displaying notifications to the user.

**Provider Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The components that should have access to the notification context |

**Context Values:**

| Name | Type | Description |
|------|------|-------------|
| notifications | array | Array of current notifications |
| showNotification | function | Function to show a notification |
| closeNotification | function | Function to close a notification |

**Usage:**

```jsx
import { NotificationProvider, useNotification } from '../contexts/NotificationContext';

// Wrap your application with the provider
const App = () => {
  return (
    <NotificationProvider>
      <MyComponent />
    </NotificationProvider>
  );
};

// Use the context in a component
const MyComponent = () => {
  const { showNotification } = useNotification();
  
  const handleClick = () => {
    showNotification({
      message: 'Operation successful',
      type: 'success',
    });
  };
  
  return (
    <button onClick={handleClick}>
      Show Notification
    </button>
  );
};
``` 