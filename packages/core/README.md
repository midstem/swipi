# @swipi/core

The framework-agnostic core engine for Swipi.

This package provides the underlying logic, physics, and state management for the carousel. It is entirely free of framework-specific code (like React).

> **Note**: This package is an internal dependency. It is not published to npm. Framework adapters (like `@swipi/react`) import it directly as TypeScript source and bundle it, so consumers never need to install `@swipi/core` directly.
