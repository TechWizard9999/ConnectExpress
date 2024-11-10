/**
 * Simple Priority Queue implemented using a Min-Heap.
 */
class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    /**
     * Inserts an element into the priority queue.
     * @param {Object} element - The element to insert.
     */
    enqueue(element) {
        this.heap.push(element);
        this.bubbleUp(this.heap.length - 1);
    }

    /**
     * Removes and returns the element with the highest priority (smallest cumulativeWeight).
     * @returns {Object} The dequeued element.
     */
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

    /**
     * Checks if the priority queue is empty.
     * @returns {boolean} True if empty, else false.
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Moves the element at the given index up to maintain heap property.
     * @param {number} index - The index of the element to bubble up.
     */
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

    /**
     * Moves the element at the given index down to maintain heap property.
     * @param {number} index - The index of the element to bubble down.
     */
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

/**
 * Calculates the duration in hours and minutes between departure and arrival times.
 * Handles overnight trains by adding 24 hours if arrival is earlier than departure.
 * @param {string} departure - Departure time in "HH:MM" format.
 * @param {string} arrival - Arrival time in "HH:MM" format.
 * @returns {Object} Duration in hours and minutes.
 */
function calculateDuration(departure, arrival) {
    const [depH, depM] = departure.split(":").map(Number);
    const [arrH, arrM] = arrival.split(":").map(Number);

    let depTotal = depH * 60 + depM;
    let arrTotal = arrH * 60 + arrM;

    if (arrTotal < depTotal) {
        // Overnight train
        arrTotal += 24 * 60;
    }

    const totalMinutes = arrTotal - depTotal;
    const hrs = Math.floor(totalMinutes / 60);
    const min = totalMinutes % 60;

    return { hrs, min };
}

/**
 * Maps risk factor to numerical value.
 * Low = 1, Medium = 2, High = 3
 * @param {string} risk - Risk factor.
 * @returns {number} Numerical risk value.
 */
function riskFactorValue(risk) {
    const mapping = { Low: 1, Medium: 2, High: 3 };
    return mapping[risk] || 1;
}

/**
 * Builds the graph from train data.
 * @param {Array} trains - Array of train objects.
 * @returns {Object} Graph represented as an adjacency list.
 */
function buildGraph(trains) {
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

/**
 * Calculates the connection time between arrival and departure.
 * @param {string} arrivalTime - Arrival time in "HH:MM" format.
 * @param {string} departureTime - Departure time in "HH:MM" format.
 * @returns {number} Connection time in minutes.
 */
function calculateConnectionTime(arrivalTime, departureTime) {
    const [arrH, arrM] = arrivalTime.split(":").map(Number);
    const [depH, depM] = departureTime.split(":").map(Number);

    let arrTotal = arrH * 60 + arrM;
    let depTotal = depH * 60 + depM;

    if (depTotal < arrTotal) {
        // Departure is on the next day
        depTotal += 24 * 60;
    }

    return depTotal - arrTotal;
}

/**
 * Finds optimal routes using a modified Dijkstra's algorithm.
 * Initializes the queue with all available starting trains to exclude initial buffer time.
 * @param {Object} graph - Graph represented as an adjacency list.
 * @param {string} start - Starting station code.
 * @param {string} end - Destination station code.
 * @param {number} maxConnections - Maximum number of connections allowed.
 * @returns {Array} Array of optimal routes.
 */
function findOptimalRoutes(graph, start, end, maxConnections = 3) {
    // Initialize Priority Queue
    const queue = new PriorityQueue();

    // Enqueue all available trains departing from the start station
    const startingTrains = graph[start] || [];
    startingTrains.forEach((train) => {
        if (train.availability.toLowerCase() !== "full") {
            const duration = calculateDuration(train.departureTime, train.arrivalTime);
            queue.enqueue({
                current: train.to,
                path: [start, train.to],
                cumulativeRisk: train.risk,
                totalDuration: duration.hrs * 60 + duration.min,
                cumulativeWeight: (duration.hrs * 60 + duration.min) + train.risk,
                currentTime: train.arrivalTime,
                legs: [
                    {
                        trainNo: train.trainNo,
                        trainName: train.trainName,
                        from: start,
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

        // If destination is reached
        if (current === end) {
            optimalRoutes.push({
                path,
                totalDuration: { hrs: Math.floor(totalDuration / 60), min: totalDuration % 60 },
                cumulativeRisk,
                legs,
            });
            continue;
        }

        // Limit the number of connections
        if (path.length - 1 >= maxConnections) {
            continue;
        }

        // Explore neighboring trains
        const neighbors = graph[current] || [];

        neighbors.forEach((train) => {
            if (train.availability.toLowerCase() === "full") {
                return; // Skip trains that are fully booked
            }

            const { to, departureTime, arrivalTime, riskFactor } = train;

            // Avoid cycles
            if (path.includes(to)) {
                return;
            }

            // Calculate connection time
            const bufferMinutes = 10; // Minimum buffer time
            const connectionTime = calculateConnectionTime(
                currentTime,
                departureTime
            );
            if (connectionTime < bufferMinutes) {
                return;
            }

            // Calculate new total duration and cumulative weight
            const duration = calculateDuration(departureTime, arrivalTime);
            const risk = riskFactorValue(riskFactor);

            const newTotalDuration = totalDuration + connectionTime + (duration.hrs * 60 + duration.min);
            const newCumulativeRisk = cumulativeRisk + risk;
            const newCumulativeWeight = newTotalDuration + newCumulativeRisk;

            // New path
            const newPath = [...path, to];

            // New legs
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
                    totalDuration: { hrs: duration.hrs, min: duration.min },
                },
            ];

            // Enqueue the new node
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

    // Sort the routes by totalDuration and then by cumulativeRisk
    optimalRoutes.sort((a, b) => {
        if (a.totalDuration.hrs === b.totalDuration.hrs) {
            if (a.totalDuration.min === b.totalDuration.min) {
                return a.cumulativeRisk - b.cumulativeRisk;
            }
            return a.totalDuration.min - b.totalDuration.min;
        }
        return a.totalDuration.hrs - b.totalDuration.hrs;
    });

    return optimalRoutes;
}

export { buildGraph, findOptimalRoutes };
