# IoLytics UML Diagrams
---

## Use Case Diagram

Shows all use cases in the IoLytics system.

```mermaid
graph TB
    User((User))
    
    subgraph IoLytics["IoLytics System"]
        UC1[View Dashboard]
        UC2[View Devices]
        UC3[View Device Details]
        UC4[Update Device Status]
        UC5[View Analytics]
        UC6[View Logs]
        UC7[Filter Logs]
        UC8[Create Log Entry]
        UC9[View Live Data]
    end
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    
    UC2 -.->|extends| UC3
    UC6 -.->|extends| UC7
    
    style User fill:#61dafb
    style UC1 fill:#4ecdc4
    style UC2 fill:#4ecdc4
    style UC3 fill:#4ecdc4
    style UC4 fill:#4ecdc4
    style UC5 fill:#4ecdc4
    style UC6 fill:#4ecdc4
    style UC7 fill:#4ecdc4
    style UC8 fill:#4ecdc4
    style UC9 fill:#4ecdc4
```

---

## Use Case 1: View Dashboard

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard as Dashboard Component
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as JSON Files
    
    User->>Dashboard: Navigate to Dashboard
    Dashboard->>Dashboard: Component Mounts
    Dashboard->>NotifCtx: useNotification()
    Dashboard->>API: deviceAPI.getAll()
    Dashboard->>API: analyticsAPI.getData()
    Dashboard->>API: logsAPI.getAll(limit: 5)
    Dashboard->>API: liveAPI.getData()
    
    API->>Backend: GET /api/devices
    Backend->>FS: Read devices.json
    FS->>Data: Load devices data
    Data-->>FS: Return devices
    FS-->>Backend: Device array
    Backend-->>API: JSON response
    
    API->>Backend: GET /api/analytics
    Backend-->>API: Analytics data
    
    API->>Backend: GET /api/logs?limit=5
    Backend->>FS: Read logs.json
    FS->>Data: Load logs data
    Data-->>FS: Return logs
    FS-->>Backend: Log array
    Backend-->>API: JSON response
    
    API->>Backend: GET /api/live
    Backend-->>API: Live sensor data
    
    API-->>Dashboard: All data received
    Dashboard->>Dashboard: Update state
    Dashboard-->>User: Render dashboard UI
    
    loop Every 3 seconds
        Dashboard->>API: liveAPI.getData()
        API->>Backend: GET /api/live
        Backend-->>API: Updated live data
        API-->>Dashboard: New live data
        Dashboard->>Dashboard: Update live data state
        Dashboard-->>User: Update UI with new values
    end
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Opens Dashboard])
    Start --> Mount[Component Mounts]
    Mount --> InitState[Initialize State Variables]
    InitState --> InitContext[Initialize Notification Context]
    InitContext --> SetLoading[Set Loading = true]
    SetLoading --> FetchDevices[Fetch Devices Data]
    FetchDevices --> FetchAnalytics[Fetch Analytics Data]
    FetchAnalytics --> FetchLogs[Fetch Recent Logs]
    FetchLogs --> FetchLive[Fetch Live Data]
    
    FetchLive --> CheckSuccess{All Requests<br/>Successful?}
    CheckSuccess -->|Yes| UpdateState[Update Component State]
    CheckSuccess -->|No| HandleError[Handle Error]
    HandleError --> ShowError[Display Error Message]
    ShowError --> End([End])
    
    UpdateState --> SetLoadingFalse[Set Loading = false]
    SetLoadingFalse --> RenderUI[Render Dashboard UI]
    RenderUI --> StartInterval[Start 3s Interval Timer]
    
    StartInterval --> Wait[Wait 3 seconds]
    Wait --> FetchLiveUpdate[Fetch Updated Live Data]
    FetchLiveUpdate --> UpdateLiveState[Update Live Data State]
    UpdateLiveState --> ReRender[Re-render UI]
    ReRender --> Wait
    
    RenderUI --> End
    ReRender --> Wait
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style CheckSuccess fill:#ffe66d
```

---

## Use Case 2: View Devices

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant DevicesPage as Devices Page Component
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as devices.json
    
    User->>DevicesPage: Navigate to Devices Page
    DevicesPage->>DevicesPage: Component Mounts
    DevicesPage->>API: deviceAPI.getAll()
    API->>Backend: GET /api/devices
    Backend->>FS: fs.readFileSync('devices.json')
    FS->>Data: Read file
    Data-->>FS: Return JSON string
    FS-->>Backend: File content
    Backend->>Backend: JSON.parse(data)
    Backend-->>API: Device array
    API-->>DevicesPage: Devices data
    DevicesPage->>DevicesPage: setDevices(data)
    DevicesPage->>DevicesPage: Render device list
    DevicesPage-->>User: Display devices
    
    alt Filter by Status
        User->>DevicesPage: Select status filter
        DevicesPage->>API: deviceAPI.getAll(status: 'online')
        API->>Backend: GET /api/devices?status=online
        Backend->>Backend: Filter devices by status
        Backend-->>API: Filtered devices
        API-->>DevicesPage: Filtered data
        DevicesPage-->>User: Display filtered devices
    end
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Opens Devices Page])
    Start --> Mount[Component Mounts]
    Mount --> InitState[Initialize State]
    InitState --> SetLoading[Set Loading = true]
    SetLoading --> FetchDevices["Call deviceAPI.getAll()"]
    
    FetchDevices --> CheckParams{Query Parameters?}
    CheckParams -->|Yes| AddParams[Add params to request]
    CheckParams -->|No| SendRequest[Send GET Request]
    AddParams --> SendRequest
    
    SendRequest --> WaitResponse[Wait for Response]
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    
    CheckResponse -->|Yes| ParseData[Parse JSON Response]
    CheckResponse -->|No| HandleError[Handle Error]
    HandleError --> ShowError[Display Error Message]
    ShowError --> End([End])
    
    ParseData --> UpdateState[Update Devices State]
    UpdateState --> SetLoadingFalse[Set Loading = false]
    SetLoadingFalse --> RenderList[Render Device List]
    RenderList --> WaitUserAction[Wait for User Action]
    
    WaitUserAction --> UserAction{User Action?}
    UserAction -->|Filter| ApplyFilter[Apply Status Filter]
    UserAction -->|View Details| NavigateDetails[Navigate to Device Details]
    UserAction -->|None| WaitUserAction
    
    ApplyFilter --> FetchDevices
    NavigateDetails --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style CheckParams fill:#ffe66d
    style CheckResponse fill:#ffe66d
    style UserAction fill:#ffe66d
```

---

## Use Case 3: View Device Details

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant DevicesPage as Devices Page
    participant DeviceCard as Device Card Component
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as devices.json
    
    User->>DeviceCard: Click on Device Card
    DeviceCard->>API: deviceAPI.getById(deviceId)
    API->>Backend: GET /api/devices/:id
    Backend->>FS: Read devices.json
    FS->>Data: Load all devices
    Data-->>FS: Return devices array
    FS-->>Backend: Devices array
    Backend->>Backend: Find device by ID
    Backend->>Backend: Check if device exists
    
    alt Device Found
        Backend-->>API: Device object
        API-->>DeviceCard: Device data
        DeviceCard->>DeviceCard: Display device details
        DeviceCard-->>User: Show device information
    else Device Not Found
        Backend-->>API: 404 Error
        API-->>DeviceCard: Error response
        DeviceCard->>DeviceCard: Display error message
        DeviceCard-->>User: Show "Device not found"
    end
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Clicks Device])
    Start --> GetID[Get Device ID]
    GetID --> CallAPI[Call deviceAPI.getById(id)]
    CallAPI --> SendRequest[Send GET /api/devices/:id]
    SendRequest --> WaitResponse[Wait for Response]
    
    WaitResponse --> CheckResponse{Response<br/>Status?}
    CheckResponse -->|200 OK| ParseData[Parse Device Data]
    CheckResponse -->|404| ShowNotFound[Show 'Device Not Found']
    CheckResponse -->|500| ShowError[Show Error Message]
    
    ParseData --> DisplayDetails[Display Device Details]
    DisplayDetails --> ShowInfo[Show Device Information:<br/>- Name, Type, Location<br/>- Status, Last Active<br/>- Readings Data]
    ShowInfo --> End([End])
    
    ShowNotFound --> End
    ShowError --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style CheckResponse fill:#ffe66d
```

---

## Use Case 4: Update Device Status

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant DeviceCard as Device Card
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as devices.json
    
    User->>DeviceCard: Click Update Status Button
    DeviceCard->>DeviceCard: Show Status Options
    User->>DeviceCard: Select New Status (online/offline)
    DeviceCard->>API: deviceAPI.updateStatus(id, status)
    API->>Backend: POST /api/devices/:id/status<br/>Body: {status: 'online'}
    
    Backend->>FS: Read devices.json
    FS->>Data: Load devices
    Data-->>FS: Return devices array
    FS-->>Backend: Devices array
    Backend->>Backend: Find device by ID
    Backend->>Backend: Update device.status
    Backend->>Backend: Update device.lastActive = now()
    
    Backend->>FS: Write devices.json
    FS->>Data: Save updated devices
    Data-->>FS: Write successful
    FS-->>Backend: Success
    Backend-->>API: Updated device object
    API-->>DeviceCard: Updated device data
    DeviceCard->>DeviceCard: Update local state
    DeviceCard->>DeviceCard: Re-render component
    DeviceCard-->>User: Show updated status
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Clicks Update Status])
    Start --> ShowOptions[Show Status Options]
    ShowOptions --> UserSelects{User Selects<br/>Status?}
    UserSelects -->|Cancel| End([Cancel])
    UserSelects -->|Select Status| GetStatus[Get Selected Status]
    
    GetStatus --> ValidateStatus{Status Valid?}
    ValidateStatus -->|No| ShowError[Show Validation Error]
    ValidateStatus -->|Yes| CallAPI[Call deviceAPI.updateStatus(id, status)]
    
    ShowError --> End
    
    CallAPI --> SendRequest[Send POST Request]
    SendRequest --> WaitResponse[Wait for Response]
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    
    CheckResponse -->|404| ShowNotFound[Show 'Device Not Found']
    CheckResponse -->|500| ShowServerError[Show Server Error]
    CheckResponse -->|200| ParseResponse[Parse Updated Device]
    
    ShowNotFound --> End
    ShowServerError --> End
    
    ParseResponse --> UpdateFile[Backend: Update devices.json]
    UpdateFile --> UpdateState[Update Component State]
    UpdateState --> ReRender[Re-render Component]
    ReRender --> ShowSuccess[Show Success Message]
    ShowSuccess --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style UserSelects fill:#ffe66d
    style ValidateStatus fill:#ffe66d
    style CheckResponse fill:#ffe66d
```

---

## Use Case 5: View Analytics

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant AnalyticsPage as Analytics Page
    participant API as API Client
    participant Backend as Express Backend
    
    User->>AnalyticsPage: Navigate to Analytics Page
    AnalyticsPage->>AnalyticsPage: Component Mounts
    AnalyticsPage->>API: analyticsAPI.getData()
    API->>Backend: GET /api/analytics
    Backend->>Backend: Generate Analytics Data
    Note over Backend: Generate temperature, humidity,<br/>RFID scans, energy,<br/>soil moisture data
    Backend-->>API: Analytics JSON
    API-->>AnalyticsPage: Analytics data
    AnalyticsPage->>AnalyticsPage: Update state
    AnalyticsPage->>AnalyticsPage: Render charts
    AnalyticsPage-->>User: Display analytics dashboard
    
    alt View Device Types
        User->>AnalyticsPage: Click Device Types
        AnalyticsPage->>API: analyticsAPI.getDeviceTypes()
        API->>Backend: GET /api/analytics/device-types
        Backend-->>API: Device type distribution
        API-->>AnalyticsPage: Distribution data
        AnalyticsPage-->>User: Show device type chart
    end
    
    alt View RFID Stats
        User->>AnalyticsPage: View RFID Statistics
        AnalyticsPage->>API: GET /api/analytics/rfid-stats
        API->>Backend: GET /api/analytics/rfid-stats
        Backend-->>API: RFID statistics
        API-->>AnalyticsPage: Stats data
        AnalyticsPage-->>User: Display RFID stats
    end
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Opens Analytics Page])
    Start --> Mount[Component Mounts]
    Mount --> InitState[Initialize State]
    InitState --> SetLoading[Set Loading = true]
    SetLoading --> FetchAnalytics[Call analyticsAPI.getData()]
    
    FetchAnalytics --> SendRequest[Send GET /api/analytics]
    SendRequest --> WaitResponse[Wait for Response]
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    
    CheckResponse -->|No| HandleError[Handle Error]
    CheckResponse -->|Yes| ParseData[Parse Analytics Data]
    
    HandleError --> ShowError[Display Error]
    ShowError --> End([End])
    
    ParseData --> ExtractData[Extract Data:<br/>- Temperature trends<br/>- Humidity data<br/>- RFID scans<br/>- Energy consumption<br/>- Soil moisture]
    
    ExtractData --> UpdateState[Update Analytics State]
    UpdateState --> SetLoadingFalse[Set Loading = false]
    SetLoadingFalse --> RenderCharts[Render Charts with Recharts]
    
    RenderCharts --> DisplayCharts[Display:<br/>- Temperature Line Chart<br/>- RFID Bar Chart<br/>- Energy Line Chart<br/>- Humidity Chart]
    
    DisplayCharts --> WaitUserAction[Wait for User Action]
    
    WaitUserAction --> UserAction{User Action?}
    UserAction -->|View Device Types| FetchTypes[Fetch Device Types]
    UserAction -->|View RFID Stats| FetchRFID[Fetch RFID Stats]
    UserAction -->|View Energy Stats| FetchEnergy[Fetch Energy Stats]
    UserAction -->|None| WaitUserAction
    
    FetchTypes --> UpdateTypes[Update UI with Types]
    FetchRFID --> UpdateRFID[Update UI with RFID Stats]
    FetchEnergy --> UpdateEnergy[Update UI with Energy Stats]
    
    UpdateTypes --> WaitUserAction
    UpdateRFID --> WaitUserAction
    UpdateEnergy --> WaitUserAction
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style CheckResponse fill:#ffe66d
    style UserAction fill:#ffe66d
```

---

## Use Case 6: View Logs

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant LogsPage as Logs Page
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as logs.json
    
    User->>LogsPage: Navigate to Logs Page
    LogsPage->>LogsPage: Component Mounts
    LogsPage->>API: logsAPI.getAll()
    API->>Backend: GET /api/logs
    Backend->>FS: Read logs.json
    FS->>Data: Load logs data
    Data-->>FS: Return logs array
    FS-->>Backend: Logs array
    Backend->>Backend: Sort by timestamp (newest first)
    Backend-->>API: Sorted logs array
    API-->>LogsPage: Logs data
    LogsPage->>LogsPage: Update state
    LogsPage->>LogsPage: Render log list
    LogsPage-->>User: Display logs with severity colors
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Opens Logs Page])
    Start --> Mount[Component Mounts]
    Mount --> InitState[Initialize State]
    InitState --> SetLoading[Set Loading = true]
    SetLoading --> FetchLogs[Call logsAPI.getAll()]
    
    FetchLogs --> SendRequest[Send GET /api/logs]
    SendRequest --> WaitResponse[Wait for Response]
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    
    CheckResponse -->|No| HandleError[Handle Error]
    CheckResponse -->|Yes| ParseData[Parse Logs Data]
    
    HandleError --> ShowError[Display Error]
    ShowError --> End([End])
    
    ParseData --> SortLogs[Backend: Sort by timestamp]
    SortLogs --> UpdateState[Update Logs State]
    UpdateState --> SetLoadingFalse[Set Loading = false]
    SetLoadingFalse --> RenderList[Render Log List]
    
    RenderList --> FormatLogs[Format Each Log:<br/>- Severity indicator<br/>- Timestamp<br/>- Device name<br/>- Message]
    
    FormatLogs --> DisplayLogs[Display Logs:<br/>- Info: Green<br/>- Warning: Yellow<br/>- Error: Red]
    
    DisplayLogs --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style CheckResponse fill:#ffe66d
```

---

## Use Case 7: Filter Logs

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant LogsPage as Logs Page
    participant Filters as Filter Component
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as logs.json
    
    User->>Filters: Select Filter Option
    Filters->>Filters: Update Filter State
    
    alt Filter by Severity
        User->>Filters: Select Severity (info/warning/error)
        Filters->>API: logsAPI.getAll({severity: 'error'})
        API->>Backend: GET /api/logs?severity=error
        Backend->>FS: Read logs.json
        FS->>Data: Load logs
        Data-->>FS: Return logs
        FS-->>Backend: Logs array
        Backend->>Backend: Filter by severity
        Backend-->>API: Filtered logs
    end
    
    alt Filter by Device
        User->>Filters: Select Device
        Filters->>API: logsAPI.getAll({device: 'rfid_001'})
        API->>Backend: GET /api/logs?device=rfid_001
        Backend->>Backend: Filter by device
        Backend-->>API: Filtered logs
    end
    
    alt Search Logs
        User->>Filters: Enter Search Term
        Filters->>API: logsAPI.getAll({search: 'water'})
        API->>Backend: GET /api/logs?search=water
        Backend->>Backend: Filter by message content
        Backend-->>API: Filtered logs
    end
    
    alt Limit Results
        Filters->>API: logsAPI.getAll({limit: 10})
        API->>Backend: GET /api/logs?limit=10
        Backend->>Backend: Slice array to limit
        Backend-->>API: Limited logs
    end
    
    API-->>LogsPage: Filtered logs
    LogsPage->>LogsPage: Update state
    LogsPage-->>User: Display filtered results
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Applies Filter])
    Start --> SelectFilter{Filter Type?}
    
    SelectFilter -->|Severity| GetSeverity[Get Severity Value]
    SelectFilter -->|Device| GetDevice[Get Device ID]
    SelectFilter -->|Search| GetSearch[Get Search Term]
    SelectFilter -->|Limit| GetLimit[Get Limit Number]
    
    GetSeverity --> BuildParams[Build Query Parameters]
    GetDevice --> BuildParams
    GetSearch --> BuildParams
    GetLimit --> BuildParams
    
    BuildParams --> CallAPI[Call logsAPI.getAll(params)]
    CallAPI --> SendRequest[Send GET /api/logs with params]
    SendRequest --> WaitResponse[Wait for Response]
    
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    CheckResponse -->|No| HandleError[Handle Error]
    CheckResponse -->|Yes| ProcessFilters[Backend: Apply Filters]
    
    HandleError --> ShowError[Show Error]
    ShowError --> End([End])
    
    ProcessFilters --> FilterSeverity{Severity<br/>Filter?}
    FilterSeverity -->|Yes| ApplySeverity[Filter by severity]
    FilterSeverity -->|No| FilterDevice{Device<br/>Filter?}
    ApplySeverity --> FilterDevice
    
    FilterDevice -->|Yes| ApplyDevice[Filter by device]
    FilterDevice -->|No| FilterSearch{Search<br/>Filter?}
    ApplyDevice --> FilterSearch
    
    FilterSearch -->|Yes| ApplySearch[Filter by message content]
    FilterSearch -->|No| SortLogs[Sort by timestamp]
    ApplySearch --> SortLogs
    
    SortLogs --> CheckLimit{Limit<br/>Specified?}
    CheckLimit -->|Yes| ApplyLimit[Slice to limit]
    CheckLimit -->|No| ReturnResults[Return Results]
    ApplyLimit --> ReturnResults
    
    ReturnResults --> UpdateState[Update Logs State]
    UpdateState --> ReRender[Re-render Log List]
    ReRender --> ShowResults[Show Filtered Results]
    ShowResults --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style SelectFilter fill:#ffe66d
    style CheckResponse fill:#ffe66d
    style FilterSeverity fill:#ffe66d
    style FilterDevice fill:#ffe66d
    style FilterSearch fill:#ffe66d
    style CheckLimit fill:#ffe66d
```

---

## Use Case 8: Create Log Entry

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant LogsPage as Logs Page
    participant Form as Log Form Component
    participant API as API Client
    participant Backend as Express Backend
    participant FS as File System
    participant Data as logs.json
    
    User->>Form: Fill Log Form
    User->>Form: Enter severity, device, message
    User->>Form: Click Submit
    Form->>Form: Validate Input
    
    alt Valid Input
        Form->>API: logsAPI.addLog(logData)
        API->>Backend: POST /api/logs<br/>Body: {severity, device, message}
        Backend->>FS: Read logs.json
        FS->>Data: Load existing logs
        Data-->>FS: Return logs array
        FS-->>Backend: Logs array
        Backend->>Backend: Create new log object<br/>{id, timestamp, ...logData}
        Backend->>Backend: Prepend to logs array
        Backend->>FS: Write logs.json
        FS->>Data: Save updated logs
        Data-->>FS: Write successful
        FS-->>Backend: Success
        Backend-->>API: Created log object
        API-->>Form: New log data
        Form->>LogsPage: Update logs state
        LogsPage->>LogsPage: Re-render log list
        LogsPage-->>User: Show new log entry
    else Invalid Input
        Form->>Form: Show validation error
        Form-->>User: Display error message
    end
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Clicks Create Log])
    Start --> ShowForm[Show Log Form]
    ShowForm --> UserInput[User Enters Data:<br/>- Severity<br/>- Device<br/>- Message]
    
    UserInput --> ClickSubmit{User Clicks<br/>Submit?}
    ClickSubmit -->|Cancel| End([Cancel])
    ClickSubmit -->|Submit| ValidateInput[Validate Input]
    
    ValidateInput --> CheckSeverity{Severity<br/>Valid?}
    CheckSeverity -->|No| ShowSeverityError[Show Severity Error]
    CheckSeverity -->|Yes| CheckDevice{Device<br/>Valid?}
    
    ShowSeverityError --> End
    
    CheckDevice -->|No| ShowDeviceError[Show Device Error]
    CheckDevice -->|Yes| CheckMessage{Message<br/>Valid?}
    
    ShowDeviceError --> End
    
    CheckMessage -->|No| ShowMessageError[Show Message Error]
    CheckMessage -->|Yes| BuildLogData[Build Log Data Object]
    
    ShowMessageError --> End
    
    BuildLogData --> CallAPI[Call logsAPI.addLog(logData)]
    CallAPI --> SendRequest[Send POST /api/logs]
    SendRequest --> WaitResponse[Wait for Response]
    
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    CheckResponse -->|500| ShowServerError[Show Server Error]
    CheckResponse -->|201| ProcessLog[Backend: Process Log]
    
    ShowServerError --> End
    
    ProcessLog --> ReadFile[Read logs.json]
    ReadFile --> CreateLog[Create Log Object:<br/>- id: log_timestamp<br/>- timestamp: now()<br/>- severity, device, message]
    
    CreateLog --> PrependLog[Prepend to logs array]
    PrependLog --> WriteFile[Write to logs.json]
    WriteFile --> ReturnLog[Return Created Log]
    
    ReturnLog --> UpdateState[Update Logs State]
    UpdateState --> ReRender[Re-render Log List]
    ReRender --> ShowSuccess[Show Success Message]
    ShowSuccess --> ClearForm[Clear Form]
    ClearForm --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style ClickSubmit fill:#ffe66d
    style CheckSeverity fill:#ffe66d
    style CheckDevice fill:#ffe66d
    style CheckMessage fill:#ffe66d
    style CheckResponse fill:#ffe66d
```

---

## Use Case 9: View Live Data

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard as Dashboard Component
    participant API as API Client
    participant Backend as Express Backend
    
    User->>Dashboard: View Dashboard
    Dashboard->>API: liveAPI.getData()
    API->>Backend: GET /api/live
    Backend->>Backend: Generate Live Data
    Note over Backend: Generate real-time values:<br/>- Temperature, Humidity<br/>- RFID scans<br/>- Power consumption<br/>- Soil moisture, etc.
    Backend-->>API: Live data JSON
    API-->>Dashboard: Live sensor data
    Dashboard->>Dashboard: Update liveData state
    Dashboard->>Dashboard: Render live readings
    Dashboard-->>User: Display live values
    
    loop Every 3 seconds
        Dashboard->>API: liveAPI.getData()
        API->>Backend: GET /api/live
        Backend->>Backend: Generate new live data
        Backend-->>API: Updated live data
        API-->>Dashboard: New live data
        Dashboard->>Dashboard: Update state
        Dashboard-->>User: Update displayed values
    end
    
    alt View Device-Specific Live Data
        User->>Dashboard: Click on Device
        Dashboard->>API: liveAPI.getDeviceData(deviceId)
        API->>Backend: GET /api/live/:deviceId
        Backend->>Backend: Generate device-specific data
        Backend-->>API: Device live data
        API-->>Dashboard: Device data
        Dashboard-->>User: Show device live readings
    end
```

### Activity Diagram

```mermaid
flowchart TD
    Start([User Views Live Data])
    Start --> CallAPI[Call liveAPI.getData()]
    CallAPI --> SendRequest[Send GET /api/live]
    SendRequest --> WaitResponse[Wait for Response]
    
    WaitResponse --> CheckResponse{Response<br/>Successful?}
    CheckResponse -->|No| HandleError[Handle Error]
    CheckResponse -->|Yes| GenerateData[Backend: Generate Live Data]
    
    HandleError --> ShowError[Show Error]
    ShowError --> End([End])
    
    GenerateData --> CreateData[Create Live Data Object:<br/>- Temperature<br/>- Humidity<br/>- Pressure<br/>- Wind Speed<br/>- UV Index<br/>- RFID Scans<br/>- Power Consumption<br/>- Soil Moisture<br/>- etc.]
    
    CreateData --> AddTimestamp[Add updatedAt timestamp]
    AddTimestamp --> ReturnData[Return Live Data]
    
    ReturnData --> UpdateState[Update Live Data State]
    UpdateState --> RenderUI[Render Live Readings UI]
    RenderUI --> DisplayValues[Display Values in Grid]
    
    DisplayValues --> StartInterval[Start 3s Interval]
    StartInterval --> Wait3s[Wait 3 seconds]
    Wait3s --> RefreshData[Refresh Live Data]
    RefreshData --> GenerateData
    
    DisplayValues --> UserAction{User Action?}
    UserAction -->|View Device Data| GetDeviceData[Get Device-Specific Data]
    UserAction -->|None| StartInterval
    
    GetDeviceData --> CallDeviceAPI[Call liveAPI.getDeviceData(id)]
    CallDeviceAPI --> SendDeviceRequest[Send GET /api/live/:deviceId]
    SendDeviceRequest --> GenerateDeviceData[Generate Device Data]
    GenerateDeviceData --> DisplayDeviceData[Display Device Readings]
    DisplayDeviceData --> End
    
    style Start fill:#61dafb
    style End fill:#ff6b6b
    style CheckResponse fill:#ffe66d
    style UserAction fill:#ffe66d
```