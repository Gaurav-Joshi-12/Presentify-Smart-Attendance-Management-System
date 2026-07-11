# Smart Attendance Management System (ATMS)

A robust, full-stack application designed to streamline and automate student attendance tracking using QR code scanning, asynchronous processing, and real-time messaging. The system consists of a scalable Spring Boot backend and a modern React frontend.

## 🏗️ System Architecture

The ATMS is built using a microservices-inspired, event-driven architecture, cleanly separating the backend APIs and processing logic from the client-side user interfaces.

---

## ⚙️ Backend (ATMS-BACKEND)

The backend is built with **Spring Boot (Java 21)** and uses **Gradle** as its build tool. It acts as the core engine for processing business logic, handling high volumes of data asynchronously, and communicating with external APIs.

### Key Backend Features & Implementations:

* **Domain-Driven Design**: The database is structured using Hibernate/JPA entities representing core academic concepts: `College`, `Department`, `Professor`, `Student`, `Subject`, `Lecture`, and `Attendance`.
* **Event-Driven Attendance Logging (Kafka)**: 
  * To handle a surge of students marking attendance simultaneously, the system uses **Apache Kafka**.
  * When a QR code is scanned, an event is sent to the `AttendanceProducerService`.
  * The `AttendanceConsumerService` processes this queue asynchronously, ensuring no database locks or request timeouts occur during peak loads (like the start of a lecture).
* **Twilio WhatsApp Integration**:
  * Integrated with the Twilio SDK via `WhatsappService`.
  * Allows the system to trigger automated alerts, such as notifying students of their successful attendance or warning parents/guardians about low attendance metrics.
* **Role-Based API Controllers**: 
  * `AdminController`: Endpoints for managing the overall infrastructure (Colleges, Departments, Users).
  * `ProfController`: Endpoints for Professors to initiate lectures and generate session-specific QR codes.
  * `StudentController`: Endpoints for Students to retrieve their attendance history and trigger attendance logs.

### Backend Tech Stack:
* **Framework**: Spring Boot (Web, Data JPA)
* **Database**: MySQL
* **Messaging Queue**: Apache Kafka
* **External API**: Twilio SDK (WhatsApp messaging)

---

## 💻 Frontend (ATMS-FRONTEND)

The frontend is a modern web application designed for speed and responsiveness, utilizing **React 19**, **Vite**, and **TypeScript**.

### Key Frontend Features & Implementations:

* **QR Code Scanning Workflow**:
  * **Generation (`qrcode-generator.tsx`)**: When a professor starts a lecture via their dashboard (`attendance-session.$lectureId.tsx`), the system dynamically generates a time-sensitive QR code using `qrcode.react`.
  * **Scanning (`student-scan.tsx`)**: Students log into their portal and use their mobile camera. The app leverages `html5-qrcode` to scan the professor's QR code. Upon a successful scan, an API request is fired to the backend Kafka producer to log the attendance.
* **Role-Based Dashboards**: 
  * Distinct interfaces tailored for Admins (`admin-dashboard.tsx`) and Students (`student-dashboard.tsx`).
* **Client-Side Routing & State**: 
  * Uses `TanStack Router` for type-safe, seamless navigation between views.
* **Modern UI/UX**: 
  * Styled with **Tailwind CSS** and heavily utilizes **Radix UI components (shadcn/ui)** for accessible, beautiful components like modals, alerts, and navigation menus.

### Frontend Tech Stack:
* **Framework**: React 19 (via Vite)
* **Language**: TypeScript
* **Routing**: TanStack Router
* **Styling**: Tailwind CSS & Radix UI
* **Libraries**: `html5-qrcode`, `qrcode.react`, `axios`, `recharts` (for reporting)

---

## 🚀 Getting Started

### Prerequisites
* Java 21 & Gradle
* Node.js & Bun (or npm/yarn)
* MySQL Server
* Apache Kafka (running locally or via Docker)
* Twilio Account Credentials (placed in `TwillioCredentials.txt`)

### Running the Backend
1. Ensure MySQL and Kafka are running.
2. Configure your `application.properties` with database and Kafka connection details.
3. Navigate to `ATMS-BACKEND` and run:
   ```bash
   ./gradlew bootRun
   ```

### Running the Frontend
1. Navigate to `ATMS-FRONTEND`.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the Vite development server:
   ```bash
   bun run dev
   ```
