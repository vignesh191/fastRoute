/*
GIVEN:  a list of datacenters at positions (x,y)

GOAL #1: for n amount of connections located at positions (x_n, y_n),
      find the most opitimal datacenter in terms of distance for 
      a low latent connection
*/

//a Coordinate class to identify geographical locations
class Coordinate {
    constructor(x, y){
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
}

//a datacenter class with identifying geolocation data
//TODO: add and build with server addition
class DataCenter {
    constructor(name, coordinate){
        this.name = name;
        this.coordinate = coordinate;
    }
}

//a client object: i.e. people trying to connect to a phone call
class Client {
    constructor(name, coordinate){
        this.name = name;
        this.coordinate = coordinate;
    }
}


//a simple function to calculate the distance between two Coordinates
const distance = (c1, c2) => {
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;

    return Math.hypot(dx, dy)
}


// creates num number of datacenter objects
const create_datacenters = (num) => {
    let datacenter_list = []
    for(var i = 0; i < num; i++){
        let random_x = Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
        let random_y = Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
        datacenter_list.push(
            new DataCenter(`data_center ${i}`, new Coordinate(random_x, random_y))
        )
    }

    return datacenter_list
}

// creates num number of client objects
const create_clients = (num) => {
    let client_list = []
    for(var i = 0; i < num; i++){
        let random_x = Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
        let random_y = Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1);
        client_list.push(
            new Client(`client ${i}`, new Coordinate(random_x, random_y))
        )
    }

    return client_list;
}

let datacenter_list = create_datacenters(50) //50 datacenters
let client_list = create_clients(2) //instance of 2 clients

// rough method of finding least distant datacenter
let distances = []
for(var i = 0; i < client_list.length; i++){
    let curr_client = client_list[i];
    let dists_for_i = [];
    for(var j = 0; j < datacenter_list.length; j++){
        let curr_datacenter = datacenter_list[j]
        dists_for_i[j] = distance(curr_client.coordinate, curr_datacenter.coordinate)
        
    }
    distances.push(dists_for_i)
}

let avg_distances = []
for(var i = 0; i < datacenter_list.length; i++){
    let sum = 0;
    for(var j = 0; j < distances.length; j++){
        sum += distances[j][i]
    }
    avg_distances.push(sum / distances.length)
}

var min = avg_distances[0];
var minIndex = 0;

for (var i = 1; i < avg_distances.length; i++) {
    if (avg_distances[i] < min) {
        minIndex = i;
        min = avg_distances[i];
    }
}


console.log(client_list[0], client_list[1])
console.log(datacenter_list[minIndex])
