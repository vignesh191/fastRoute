//a Coordinate class to identify geographical locations
class Coordinate {
    constructor(x, y){
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
}

//a datacenter class with identifying geolocation data
class DataCenter {
    constructor(name, coordinate, num_servers){
        this.name = name;                            
        this.coordinate = coordinate;
        this.server_list = []
        for(let i = 0; i < num_servers; i++){
            this.server_list.push(new Server(`server ${i}`))
        }
        this.latency = 0;


    }
}

//a client object: i.e. people trying to connect to a phone call
class Client {
    constructor(name, remaining_bandwidth, coordinate){
        this.name = name;  
        this.remaining_bandwidth = remaining_bandwidth // probably in mB/s from 500 - 5000                    
        this.coordinate = coordinate;
    }
}

// server is defined by its connections to clients and latency
class Server { //bandwiodth
    constructor(name){
        this.name = name;
        this.connections = [];
    }
}

module.exports = {Client, DataCenter, Coordinate};
