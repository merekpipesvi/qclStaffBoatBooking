# Custom Priority Booking System

A full-stack web application designed to manage bookings with a priority-based queue system, built to handle hundreds of users during peak season.

## 🎯 Project Overview

This custom booking system was developed to replace an existing booking process while maintaining the organization's established priority system. The application manages user bookings through a points-based priority queue, where users with fewer points receive higher booking priority.

### Key Features

- **Priority Queue System**: Points-based booking priority (lower points = higher priority)
- **Tie-Breaking Logic**: Most recent booking takes precedence in case of point ties
- - **Admin Priority Bookings**: Special booking privileges for administrators on behalf of any user
- **Automated Notifications**: Email confirmations sent when queue positions change due to cancellations
- **Comprehensive Admin Dashboard**: Full site management capabilities for admin security level
- **Account Persistence**: User data and booking history maintained across sessions
- **Automated Email System**: Cron job-based email notifications for confirmations and booking updates

## 🛠 Technology Stack

### Frontend
- **Framework**: React on Typescript, Nextjs, RTKQuery and Redux
- **Deployment**: Vercel
- **Styling**: SCSS modules and Mantine

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Deployment**: Self-managed Linux VPS
- **Email System**: Automated cron jobs for notifications for relevant users and admins

### Infrastructure
- **VPS**: Custom Linux server setup and maintenance
- **Database**: MySQL for data persistence
- **Email Automation**: Two cron jobs handling confirmation and booking notifications

## 🚀 Deployment Architecture

### Backend Deployment
The backend is deployed on a self-managed Linux VPS that I configured from scratch. This approach was chosen over free hosting solutions to avoid potential bottlenecks during peak usage periods when hundreds of users access the system simultaneously each summer. Also, and more importantly, because I wanted to learn how to do it.

### Frontend Deployment
The React frontend is deployed on Vercel.

## 📋 Core Functionality

### Priority System
1. Users accumulate a single point for each successful booking
2. Queue priority determined by point totals (ascending order)
3. Tie-breaking uses most recent booking timestamp
4. Automatic queue reordering when cancellations occur
5. Users with a Priority booking have rights over all other instances
6. Users can see the weather forecast for the day

### Admin Features
- Complete site administration through accessible interface
- Priority booking creation and management
- User management and point adjustments
- Booking oversight and modification capabilities
- Capability to set days as half days, where users can book a morning or afternoon slot

### Notification System
- Automated email confirmations for successful bookings
- Queue position update notifications
- Cancellation alerts and queue advancement notices

## 🎓 Learning Objectives & Technical Growth

This project served as a comprehensive learning platform for several technologies and concepts:

- **Linux Server Administration**: VPS setup, configuration, and ongoing maintenance
- **Database Design**: MySQL schema design and optimization
- **Full-Stack Development**: End-to-end application development
- **Deployment Strategies**: Production deployment and monitoring
- **Automated Systems**: Cron job implementation for background processes
- **User Experience Design**: Admin dashboard accessibility and usability

## 🔧 Known Areas for Improvement

This project demonstrates my ability to deliver a complete solution from conception to deployment, while also showcasing my awareness of professional development practices:

### Security Enhancements
- **SQL Injection Prevention**: Current implementation may have vulnerabilities that would require parameterized queries and input sanitization
  - In the context of this project, the data is not sensitive. Backups are made frequently.
- **Authentication Hardening**: Additional security measures for user authentication and session management
- **Data Validation**: Enhanced server-side validation and sanitization

### Code Quality
- **Test Coverage**: Implementation of unit, integration, and end-to-end testing
- **Code Organization**: Refactoring for improved modularity and maintenance
- **Error Handling**: More robust error handling and logging systems

### Technical Debt
- **Framework Selection**: Express.js was chosen for rapid development; future iterations would benefit from more structured frameworks
- **File Structure**: Cleanup and reorganization of project files for better maintainability
- **Documentation**: Enhanced inline documentation and API documentation

## 📈 Project Impact

- Successfully handles hundreds of concurrent users during peak seasons
- Maintains 99%+ uptime through self-managed infrastructure
- Streamlined booking process while preserving existing organizational workflows
- Reduced administrative overhead through automated queue management

## 🏗 Development Process

This project showcases end-to-end project management and development skills:

1. **Requirements Gathering**: Understanding existing priority system and user needs
2. **System Design**: Architecture planning for scalability and reliability
3. **Implementation**: Full-stack development with consideration for user experience
4. **Deployment**: Production deployment with custom infrastructure setup
5. **Maintenance**: Ongoing system monitoring and maintenance


# Screenshots of the Website

## Login
<img width="1916" height="941" alt="image" src="https://github.com/user-attachments/assets/226467b4-1f17-446c-81b6-32bc01a99e29" />

## Register
<img width="1919" height="938" alt="image" src="https://github.com/user-attachments/assets/7d5f6b91-a577-48e8-b1b6-4e1d946884be" />

## Date Select
As per customer request, only the next 7 days are selectable.
<img width="1914" height="938" alt="image" src="https://github.com/user-attachments/assets/648082a9-6672-4c03-b89e-5b36099a4c5c" />

## Booking page
Note that half days are an option to be enabled within the admin page, but have not been selected on Live.
<img width="1915" height="944" alt="image" src="https://github.com/user-attachments/assets/75797b0b-9df7-4cc9-b8ed-3ab597d7b23f" />

## Sign Up Window
<img width="1917" height="937" alt="image" src="https://github.com/user-attachments/assets/362b1664-b91e-454d-b3b3-11e8de0e95aa" />

## Signed Up
<img width="1913" height="939" alt="image" src="https://github.com/user-attachments/assets/0ac2d850-d580-4fe2-a628-21d521238dd5" />

## Admin Page
<img width="1913" height="937" alt="image" src="https://github.com/user-attachments/assets/532b92e7-e70b-4aeb-ba7a-a796f00d3a7f" />

## View License
<img width="463" height="218" alt="image" src="https://github.com/user-attachments/assets/d2b35515-bef7-4942-bc51-f202abe532b8" />

## Priority Booking
<img width="551" height="400" alt="image" src="https://github.com/user-attachments/assets/bdbb25d7-a0e1-4ed9-972b-c63f69340c92" />

## Boat Availability
<img width="449" height="530" alt="image" src="https://github.com/user-attachments/assets/957a523c-7d70-417d-9e7e-7bccaa68d637" />


