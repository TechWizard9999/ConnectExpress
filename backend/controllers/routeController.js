const Train = require('../models/train');

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(element) {
    this.heap.push(element);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const min = this.heap[0];
    const end = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element.cumulativeWeight >= parent.cumulativeWeight) break;
      this.heap[parentIdx] = element;
      this.heap[index] = parent;
      index = parentIdx;
    }
  }

  bubbleDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let swapIdx = null;

      if (leftChildIdx < length) {
        const leftChild = this.heap[leftChildIdx];
        if (leftChild.cumulativeWeight < element.cumulativeWeight) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        const rightChild = this.heap[rightChildIdx];
        if (
          (swapIdx === null &&
            rightChild.cumulativeWeight < element.cumulativeWeight) ||
          (swapIdx !== null &&
            rightChild.cumulativeWeight < this.heap[swapIdx].cumulativeWeight)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;

      this.heap[index] = this.heap[swapIdx];
      this.heap[swapIdx] = element;
      index = swapIdx;
    }
  }
}

function calculateDuration(departure, arrival) {
  const [depH, depM] = departure.split(':').map(Number);
  const [arrH, arrM] = arrival.split(':').map(Number);

  let depTotal = depH * 60 + depM;
  let arrTotal = arrH * 60 + arrM;

  if (arrTotal < depTotal) {
    arrTotal += 24 * 60;
  }

  const totalMinutes = arrTotal - depTotal;
  const hrs = Math.floor(totalMinutes / 60);
  const min = totalMinutes % 60;

  return { hrs, min };
}

function riskFactorValue(risk) {
  const mapping = { Low: 1, Medium: 2, High: 3 };
  return mapping[risk] || 1;
}

async function buildGraph() {
  const trains = await Train.find();
  const graph = {};

  trains.forEach((train) => {
    const { from, to, departureTime, arrivalTime, availability, riskFactor } =
      train;
    const duration = calculateDuration(departureTime, arrivalTime);
    const risk = riskFactorValue(riskFactor);

    if (!graph[from]) {
      graph[from] = [];
    }

    graph[from].push({
      trainNo: train.trainNo,
      trainName: train.trainName,
      to,
      departureTime,
      arrivalTime,
      duration,
      risk,
      availability,
    });
  });

  return graph;
}

function calculateConnectionTime(arrivalTime, departureTime) {
  const [arrH, arrM] = arrivalTime.split(':').map(Number);
  const [depH, depM] = departureTime.split(':').map(Number);

  let arrTotal = arrH * 60 + arrM;
  let depTotal = depH * 60 + depM;

  if (depTotal < arrTotal) {
    depTotal += 24 * 60;
  }

  return depTotal - arrTotal;
}

exports.findOptimalRoutes = async (req, res) => {
  const { from, to } = req.body;
  const maxConnections = 3;

  try {
    const graph = await buildGraph();
    const queue = new PriorityQueue();

    const startingTrains = graph[from] || [];
    startingTrains.forEach((train) => {
      if (train.availability.toLowerCase() !== 'full') {
        const duration = calculateDuration(
          train.departureTime,
          train.arrivalTime
        );
        queue.enqueue({
          current: train.to,
          path: [from, train.to],
          cumulativeRisk: train.risk,
          totalDuration: duration.hrs * 60 + duration.min,
          cumulativeWeight: duration.hrs * 60 + duration.min + train.risk,
          currentTime: train.arrivalTime,
          legs: [
            {
              trainNo: train.trainNo,
              trainName: train.trainName,
              from: from,
              to: train.to,
              departureTime: train.departureTime,
              arrivalTime: train.arrivalTime,
              duration,
              risk: train.risk,
            },
          ],
        });
      }
    });

    const optimalRoutes = [];

    while (!queue.isEmpty()) {
      const node = queue.dequeue();
      const {
        current,
        path,
        cumulativeRisk,
        totalDuration,
        cumulativeWeight,
        currentTime,
        legs,
      } = node;

      if (current === to) {
        optimalRoutes.push({
          path,
          totalDuration: {
            hrs: Math.floor(totalDuration / 60),
            mins: totalDuration % 60,
          },
          cumulativeRisk,
          legs,
        });
        continue;
      }

      if (path.length - 1 >= maxConnections) {
        continue;
      }

      const neighbors = graph[current] || [];

      neighbors.forEach((train) => {
        if (train.availability.toLowerCase() === 'full') {
          return;
        }

        const { to, departureTime, arrivalTime, riskFactor } = train;

        if (path.includes(to)) {
          return;
        }

        const bufferMinutes = 10;
        const connectionTime = calculateConnectionTime(
          currentTime,
          departureTime
        );
        if (connectionTime < bufferMinutes) {
          return;
        }

        const duration = calculateDuration(departureTime, arrivalTime);
        const risk = riskFactorValue(riskFactor);

        const newTotalDuration =
          totalDuration + connectionTime + (duration.hrs * 60 + duration.min);
        const newCumulativeRisk = cumulativeRisk + risk;
        const newCumulativeWeight = newTotalDuration + newCumulativeRisk;

        const newPath = [...path, to];

        const newLegs = [
          ...legs,
          {
            trainNo: train.trainNo,
            trainName: train.trainName,
            from: current,
            to: to,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            duration: duration,
            risk: risk,
            totalDuration: { hrs: duration.hrs, mins: duration.min },
          },
        ];

        queue.enqueue({
          current: to,
          path: newPath,
          cumulativeRisk: newCumulativeRisk,
          totalDuration: newTotalDuration,
          cumulativeWeight: newCumulativeWeight,
          currentTime: arrivalTime,
          legs: newLegs,
        });
      });
    }

    optimalRoutes.sort((a, b) => {
      if (a.totalDuration.hrs === b.totalDuration.hrs) {
        if (a.totalDuration.mins === b.totalDuration.mins) {
          return a.cumulativeRisk - b.cumulativeRisk;
        }
        return a.totalDuration.mins - b.totalDuration.mins;
      }
      return a.totalDuration.hrs - b.totalDuration.hrs;
    });

    res.status(200).json({
      success: true,
      data: optimalRoutes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};