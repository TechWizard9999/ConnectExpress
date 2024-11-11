# ConnectExpress 🚂

> A platform that helps travelers find the best train routes by analyzing schedules and predicting delays ensuring smooth journeys during busy times.

## Overview
ConnectExpress is an intelligent railway route finder that specializes in discovering multi-leg journey options when direct trains aren't available. Using historical delay patterns and machine learning, it provides smart connection suggestions with risk assessment, making train travel planning more efficient during peak seasons.

## 🎯 Problem Statement
During peak travel seasons (like festivals), getting direct train tickets between major cities becomes challenging. While alternative routes with connections exist, current booking platforms don't show these options. ConnectExpress solves this by:

1. Finding alternative routes with connections
2. Assessing the reliability of connections using historical data
3. Recommending routes based on connection time and delay risks

## ⚠️ Important Note
Due to the unavailability of official IRCTC API and data, we have used simulated train data for demonstration purposes. The system's logic and algorithms remain applicable for real-world scenarios once integrated with actual IRCTC data.

## 🌟 Features
- **Smart Route Discovery**: Finds hidden connection opportunities between stations
- **Risk Assessment**: Predicts delay risks using ML and historical patterns
- **Intelligent Connections**: Suggests routes with optimal transfer times
- **Season-Aware**: Adjusts recommendations based on festival/peak seasons
- **Weather Impact**: Factors in weather-related delays for better planning

## 🔧 Technical Stack
- **Frontend**: Next.Js
- **Backend**: Node.Js, Express.Js
- **Database**: MongoDB
- **Algorithm**: Custom path-finding implementation in Javascript

## 🛠️ Setup and Installation

### Prerequisites
- Node.Js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
0. Fork the repository
1. Clone the repository
```sh
https://github.com/TechWizard9999/ConnectExpress
cd connectexpress
```

2. Install backend dependencies
```sh
cd backend
npm install
```

3. Create .env file
```env
MONGODB_URI=your_mongodb_uri
PORT=5000
```

4. Start the backend server
```sh
npm start
```

### Frontend Setup
1. Open a new terminal and navigate to frontend directory
```sh
cd frontend
```

2. Install frontend dependencies
```sh
npm install
```

3. Create .env file
```env
NEXT_APP_API_URL=http://localhost:3000
```

4. Start the frontend application
```sh
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure
```
connectexpress/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── stationController.js
│   │   └── trainController.js
│   ├── models/
│   │   ├── Station.js
│   │   ├── Train.js
│   ├── routes/
│   │   └── station.js
│   └── index.js
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── layout.js
│   │   └── page.js
│   └── package.json
└── README.md
```
## 🔧 FlowChart
![Flowchart](https://github.com/user-attachments/assets/c664421d-4b5a-482b-b0ce-703bd485f39f)

## 💻 Frontend Features
- **Intuitive Search**: Easy-to-use interface for route searches
- **Smart Suggestions**: Auto-complete station names
- **Visual Route Map**: Clear visualization of connections
- **Risk Indicators**: Color-coded risk assessment display
- **Time Tables**: Dynamic scheduling information

## 🔍 Algorithm Overview
Our route finding algorithm:
1. Creates a dynamic graph of train connections
2. Implements modified Dijkstra's algorithm for optimal path finding
3. Considers multiple factors:
   - Connection times
   - Historical delays
   - Station transfer times
   - Platform distances
   - Seasonal patterns

## 🛣️ Future Enhancements
- [ ] Integration with real IRCTC data
- [ ] Mobile application development
- [ ] Real-time delay notifications
- [ ] Platform crowd prediction
- [ ] User journey tracking
- [ ] Multi-language support

---
⭐️ Star this repo if you find it helpful!
---

## Our Team
   - [Sridhar Suthapalli](https://github.com/illuminati9)
   - [Roopesh S](https://github.com/techwizard9999)
   - [Raghava Kamuju](https://github.com/raghavakamuju)
   - [Pavana Saketha Ram](https://github.com/pavanasaketharam)
   - [Charan Polisetty](https://github.com/charan0313)