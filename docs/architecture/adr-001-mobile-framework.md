# ADR-001: Mobile Framework Selection

## Status
Accepted

## Context
We need to build two mobile applications (Customer App and Owner App) for BYTE++ Food. The goal is to reach both iOS and Android platforms efficiently while providing a high-quality, production-ready user experience.

## Decision
We will use **React Native** along with the **Expo** framework (and Expo Router).

## Why it was selected
- **Code Sharing**: Allows sharing the vast majority of code between iOS and Android.
- **Ecosystem**: Expo simplifies the build process, deployment (EAS), and native module integration.
- **Developer Velocity**: Fast refresh and robust tooling (TypeScript, Expo Router) drastically reduce development time.
- **Skill Reuse**: Integrates well with our TypeScript stack, and allows leveraging existing web development paradigms.

## Alternatives Considered
- **Native Development (Swift/Kotlin)**: Provides maximum performance but requires two separate codebases and specialized teams, which slows down iteration.
- **Flutter**: Excellent performance and cross-platform UI, but introduces a new language (Dart) rather than consolidating on our chosen TypeScript ecosystem.

## Trade-offs
- Slight performance overhead compared to purely native apps.
- Dependency on the Expo ecosystem for certain native capabilities and updates.
- Larger application binary size compared to native.
