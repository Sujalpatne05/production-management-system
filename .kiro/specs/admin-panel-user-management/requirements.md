# Admin Panel User Management - Requirements Document

## Introduction

The Admin Panel User Management feature provides company administrators with a comprehensive interface to manage users within their organization. This feature enables admins to add new users with role assignment, edit user information and roles, delete users, and view a complete list of all users in their company. The system enforces subscription-based user limits, prevents creation of super_admin users, and displays current user count and available slots. All operations integrate with existing backend API endpoints and maintain audit logs for compliance.

## Glossary

- **Company_Admin**: An administrator assigned to a specific company with permissions to manage only their company's users
- **Company**: A tenant organization within the multi-tenant ERP system
- **User**: An individual account within a company with role-based permissions
- **Role**: A predefined set of permissions that determines what modules and features a user can access (CEO, Finance Manager, Sales Manager, Procurement Manager, Production Manager, Quality Manager, Warehouse Manager, HR Manager, System Administrator)
- **User_Limit**: The maximum number of users a company can have based on their subscription plan
- **Subscription_Plan**: A tier defining features, user limits, and storage limits available to a company
- **User_Status**: The current state of a user account (active, inactive, pending)
- **Module_Access_Control**: Permission system that determines which modules a user can access based on their assigned role
- **Audit_Log**: A record of system actions including who performed them, what changed, and when
- **Super_Admin**: A system-level administrator with unrestricted access (cannot be created by company admins)
- **API_Endpoint**: Backend service endpoint for user management operations (GET, POST, PUT, DELETE at /api/company-admin/users)

## Requirements

### Requirement 1: Display User List

**User Story:** As a company admin, I want to view a list of all users in my company, so that I can see who has access to the system and their assigned roles.

#### Acceptance Criteria

1. WHEN a company admin navigates to the Users section, THE User_Management_Panel SHALL display a paginated list of all users in their company
2. WHEN the user list is displayed, THE Panel SHALL show each user's name, email, role, status, and creation date
3. WHEN the user list loads, THE System SHALL fetch users from the GET /api/company-admin/users endpoint filtered by the admin's company
4. WHEN the user list contains more than 10 users, THE Panel SHALL implement pagination with page size options (10, 25, 50)
5. WHEN a user's status changes, THE Panel SHALL update the display in real-time or upon refresh
6. WHEN the user list is empty, THE Panel SHALL display a message "No users found" with an option to add the first user

### Requirement 2: Add New User

**User Story:** As a company admin, I want to add new users to my company with name, email, and role selection, so that I can grant access to team members.

#### Acceptance Criteria

1. WHEN a company admin clicks "Add User" button, THE Panel SHALL display a form with required fields: name, email, and role selection
2. WHEN the role selection dropdown is displayed, THE System SHALL show all 9 available roles: CEO, Finance Manager, Sales Manager, Procurement Manager, Production Manager, Quality Manager, Warehouse Manager, HR Manager, System Administrator
3. WHEN a company admin submits the form with valid data, THE System SHALL send a POST request to /api/company-admin/users with name, email, and role
4. WHEN the user is successfully created, THE System SHALL display a success message and add the new user to the list
5. WHEN a company admin attempts to add a user and the company has reached its user limit, THE System SHALL reject the request and display "User limit reached: X/Y users"
6. WHEN a company admin attempts to create a user with super_admin role, THE System SHALL reject the request and display "Super admin users cannot be created by company admins"
7. WHEN the form is submitted with invalid data (missing fields, invalid email), THE System SHALL display specific error messages for each field
8. WHEN a user with the same email already exists, THE System SHALL reject the request and display "Email already in use"

### Requirement 3: Edit User Information and Role

**User Story:** As a company admin, I want to edit user information and change their assigned role, so that I can keep user data current and adjust permissions as needed.

#### Acceptance Criteria

1. WHEN a company admin clicks on a user in the list, THE Panel SHALL display the user's details in an edit form
2. WHEN the edit form is displayed, THE Panel SHALL show editable fields: name, email, and role selection
3. WHEN a company admin updates user information and submits the form, THE System SHALL send a PUT request to /api/company-admin/users/{userId} with the updated data
4. WHEN the user is successfully updated, THE System SHALL display a success message and update the user in the list
5. WHEN a company admin attempts to change a user's role to super_admin, THE System SHALL reject the request and display "Super admin role cannot be assigned"
6. WHEN the form is submitted with invalid data, THE System SHALL display specific error messages and prevent submission
7. WHEN a user's role is changed, THE System SHALL apply the new module access control permissions immediately
8. WHEN an email is changed to one already in use, THE System SHALL reject the request and display "Email already in use"

### Requirement 4: Delete User

**User Story:** As a company admin, I want to delete users from my company, so that I can remove access for team members who no longer need it.

#### Acceptance Criteria

1. WHEN a company admin clicks the delete button for a user, THE Panel SHALL display a confirmation dialog with the user's name and email
2. WHEN the admin confirms the deletion, THE System SHALL send a DELETE request to /api/company-admin/users/{userId}
3. WHEN the user is successfully deleted, THE System SHALL remove the user from the list and display a success message
4. WHEN a user is deleted, THE System SHALL decrement the active user count and free up a slot for new users
5. WHEN a user is deleted, THE System SHALL log the deletion in the audit log with admin ID, timestamp, and user details
6. WHEN the deletion fails, THE System SHALL display an error message and keep the user in the list
7. WHEN a company admin attempts to delete the last admin user in the company, THE System SHALL reject the request and display "Cannot delete the last admin user"

### Requirement 5: Display User Count and Limits

**User Story:** As a company admin, I want to see the current user count and remaining available slots, so that I know how many more users I can add.

#### Acceptance Criteria

1. WHEN the Users section is displayed, THE Panel SHALL show a summary card with "Current Users: X / Y" where X is current count and Y is the limit
2. WHEN the summary is displayed, THE Panel SHALL show the remaining available slots as "Available Slots: Z"
3. WHEN a user is added, THE System SHALL increment the current user count and decrement available slots
4. WHEN a user is deleted, THE System SHALL decrement the current user count and increment available slots
5. WHEN the user count reaches the limit, THE Panel SHALL display a warning "User limit reached" and disable the "Add User" button
6. WHEN the subscription plan is upgraded, THE System SHALL update the user limit and enable the "Add User" button if slots become available
7. WHEN the user count is displayed, THE System SHALL fetch the current count from the backend to ensure accuracy

### Requirement 6: Prevent Super Admin Creation

**User Story:** As a system architect, I want to prevent company admins from creating super_admin users, so that system-level access is restricted to authorized personnel.

#### Acceptance Criteria

1. WHEN a company admin views the role selection dropdown, THE Panel SHALL NOT display the super_admin role as an option
2. WHEN a company admin attempts to create a user with super_admin role through the API, THE System SHALL reject the request with status 403 Forbidden
3. WHEN a company admin attempts to change a user's role to super_admin, THE System SHALL reject the request with status 403 Forbidden
4. WHEN a super_admin role creation attempt is made, THE System SHALL log the unauthorized attempt in the audit log
5. WHEN the role dropdown is displayed, THE Panel SHALL only show the 9 allowed roles for company admins

### Requirement 7: Form Validation and Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can understand what happened and how to fix it.

#### Acceptance Criteria

1. WHEN a user submits a form with missing required fields, THE System SHALL display "This field is required" for each empty field
2. WHEN a user enters an invalid email format, THE System SHALL display "Please enter a valid email address"
3. WHEN a user enters a name with less than 2 characters, THE System SHALL display "Name must be at least 2 characters"
4. WHEN a user attempts an action without permission, THE System SHALL display "Access Denied" and log the attempt
5. WHEN a database operation fails, THE System SHALL display "An error occurred. Please try again later" and log the technical error
6. WHEN a network request fails, THE System SHALL display "Connection error. Please check your internet and try again"
7. WHEN a duplicate email is detected, THE System SHALL display "This email is already in use"
8. WHEN the user limit is exceeded, THE System SHALL display "User limit reached: X/Y users. Please upgrade your plan to add more users"

### Requirement 8: Responsive UI Design

**User Story:** As a user, I want the admin panel to work well on different screen sizes, so that I can manage users from any device.

#### Acceptance Criteria

1. WHEN the panel is viewed on a desktop (1024px+), THE UI SHALL display the full user list with all columns visible
2. WHEN the panel is viewed on a tablet (768px-1023px), THE UI SHALL display a condensed view with essential columns (name, email, role, actions)
3. WHEN the panel is viewed on a mobile device (<768px), THE UI SHALL display a card-based layout with user information stacked vertically
4. WHEN a form is displayed on mobile, THE Panel SHALL stack form fields vertically and ensure buttons are easily tappable
5. WHEN the panel is resized, THE UI SHALL adapt smoothly without breaking layout or functionality
6. WHEN the user list is displayed on mobile, THE Panel SHALL implement a swipe action or menu for edit/delete actions

### Requirement 9: Integration with Backend API

**User Story:** As a developer, I want the user management panel to integrate seamlessly with existing backend API endpoints, so that all operations work consistently.

#### Acceptance Criteria

1. WHEN a user list is requested, THE System SHALL call GET /api/company-admin/users and parse the response into user objects
2. WHEN a new user is created, THE System SHALL call POST /api/company-admin/users with name, email, and role in the request body
3. WHEN a user is updated, THE System SHALL call PUT /api/company-admin/users/{userId} with updated fields in the request body
4. WHEN a user is deleted, THE System SHALL call DELETE /api/company-admin/users/{userId}
5. WHEN an API request fails with status 401, THE System SHALL redirect to login
6. WHEN an API request fails with status 403, THE System SHALL display "Access Denied"
7. WHEN an API request fails with status 400, THE System SHALL display the error message from the response
8. WHEN an API request fails with status 500, THE System SHALL display "Server error. Please try again later"

### Requirement 10: Audit Logging

**User Story:** As a compliance officer, I want all user management actions to be logged, so that I can track changes and investigate issues.

#### Acceptance Criteria

1. WHEN a user is created, THE System SHALL log the action with admin ID, action type "create", user details, and timestamp
2. WHEN a user is updated, THE System SHALL log the action with admin ID, action type "update", changed fields, and timestamp
3. WHEN a user is deleted, THE System SHALL log the action with admin ID, action type "delete", user details, and timestamp
4. WHEN an unauthorized action is attempted, THE System SHALL log the attempt with admin ID, action type, timestamp, and failure reason
5. WHEN audit logs are created, THE System SHALL capture the IP address of the requesting admin
6. WHEN audit logs are queried, THE System SHALL return results ordered by most recent first

### Requirement 11: Shadcn UI Component Integration

**User Story:** As a developer, I want to use Shadcn UI components for consistency, so that the admin panel matches the design system.

#### Acceptance Criteria

1. WHEN the user list is displayed, THE Panel SHALL use Shadcn Table component for the user list
2. WHEN forms are displayed, THE Panel SHALL use Shadcn Form components for input fields
3. WHEN dialogs are displayed, THE Panel SHALL use Shadcn Dialog component for confirmations and modals
4. WHEN buttons are displayed, THE Panel SHALL use Shadcn Button component with appropriate variants
5. WHEN error messages are displayed, THE Panel SHALL use Shadcn Alert component for error notifications
6. WHEN success messages are displayed, THE Panel SHALL use Shadcn Toast component for success notifications
7. WHEN dropdowns are displayed, THE Panel SHALL use Shadcn Select component for role selection

### Requirement 12: Company Isolation

**User Story:** As a system architect, I want to ensure company admins can only manage users in their own company, so that data remains isolated between companies.

#### Acceptance Criteria

1. WHEN a company admin requests the user list, THE System SHALL filter users by their company ID
2. WHEN a company admin attempts to access another company's users, THE System SHALL deny the request and display "Access Denied"
3. WHEN a user is created, THE System SHALL automatically assign the company ID from the requesting admin's context
4. WHEN a user is updated or deleted, THE System SHALL verify the user belongs to the admin's company before allowing the operation
5. WHEN an unauthorized cross-company access is attempted, THE System SHALL log the attempt in the audit log
6. WHEN the backend API receives a request, THE System SHALL validate the company ID matches the requesting user's company
