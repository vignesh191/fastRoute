/*
GIVEN:  a list of datacenters at positions (x,y)

GOAL #1: for n amount of connections located at positions (x_n, y_n),
      find the most opitimal datacenter in terms of distance for 
      a low latent connection
*/
//a simple function to calculate the distance between two Coordinates
const {Coordinate, Client, DataCenter} =  require('./classes.js');
const SERVER_MAX_CONN = 5;
const LATENCY_MULT = 0.60;

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
        let rand_num_servers = Math.floor(Math.random() * (10) + 1)
        datacenter_list.push(
            new DataCenter(`data_center ${i}`, new Coordinate(random_x, random_y), rand_num_servers)
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
        let random_bandwidth = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
        client_list.push(
            new Client(`client ${i}`, random_bandwidth, new Coordinate(random_x, random_y))
        )
    }

    return client_list;
}


let datacenter_list = create_datacenters(3) // n datacenters
let client_list = create_clients(3) // n clients

// rough method of finding least distant datacenter
// for each client avg dist to all datacenters are calculated.
// min distance is the datacenter of preference
const find_datacenters_by_dist = (client_list, datacenter_list) => {
    var avg_dist_to_client = new Array(datacenter_list.length).fill(0);
    for(let i = 0; i < datacenter_list.length; i++){
        for(let j = 0; j < client_list.length; j++){
            avg_dist_to_client[i] += distance(datacenter_list[i].coordinate, client_list[j].coordinate)
        }

        avg_dist_to_client[i] = avg_dist_to_client[i] / client_list.length
    }

    let datacenters_with_dists = [];
    for(let i = 0; i < datacenter_list.length; i++){
        console.log(avg_dist_to_client[i])
        datacenter_list[i].latency = avg_dist_to_client[i] * LATENCY_MULT;
        datacenters_with_dists[i] = {datacenter: datacenter_list[i], avg_distance: avg_dist_to_client[i]}
    }
    datacenters_with_dists.sort((a,b) => a.avg_distance - b.avg_distance)

    console.log('Closest data center to all clients is:')
    console.log(datacenters_with_dists[0].datacenter)

    return datacenters_with_dists;
}

const configure_connections = (client_list, ordered_datacenters) => {
    let clients = client_list;
    for(let i = 0; i < ordered_datacenters.length; i++){
        let servers = ordered_datacenters[i].datacenter.server_list;
        servers.forEach((server) => {
            while(server.connections.length < SERVER_MAX_CONN && clients.length > 0){
                let the_client = clients.shift()
                the_client.remaining_bandwidth = the_client.remaining_bandwidth - (ordered_datacenters[i].latency * 0.3)
                if(the_client.remaining_bandwidth <= 0) {
                    console.log(`Client ${the_client.name} has run out of available bandwidth.`)
                }
                server.connections.push(the_client)
            }
        })

    }

    let all_servers = ordered_datacenters.map((dc) => dc.datacenter.server_list) 

    let active_servers = [].concat(...all_servers).filter((server) => server.connections.length > 0)

    //let active_connections = active_servers.map((server_list) => server_list.filter((server) => server.connections.length > 0))
    console.log("The servers being used are:")
    console.log(active_servers)
    //let active_connections = active_servers.map((server) => server.connections);
}


let ordered_datacenters = find_datacenters_by_dist(client_list, datacenter_list)
configure_connections(client_list, ordered_datacenters)