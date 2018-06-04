# WebApp Mean Template

Personal Mean template for creating WebApps.

## Goals:
- Full TypeScript to maximize type checking
- Stateless design
- Webserver runs code, database stores users and content, server caches content
- Custom CMS based on rankings
  - User management:
    - Developer: manage user database
    - SuperAdmin: manage admins and users
    - Admin: manage users
  - Content management:
    - Developer: easy uploads and easy editing or implementing pages with content from the database
    - Admin: easy editing of texts, lists and changing images
- Local cache provided by service worker with offline support
- Material Design
- Theme switcher provided by Angular Material Design
- Up to date with the latest technologies
- Fully deployable with just NPM

## Technologies:
- NodeJs 8
- Express 4
- MongoDB 3
- Angular v6
- ReactiveX/rxjs
