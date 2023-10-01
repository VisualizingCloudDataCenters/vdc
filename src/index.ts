import * as d3 from "d3";
// Your JSON data
const data = generateData();
console.log(data);

interface Application {
	customer: string;
	allocated_cores: number;
	allocated_memory: number;
	utilization: number[];
};

interface Server {
	position: number[];
	temperature: number;
	total_cores: number;
	total_memory: number;
	applications: Application[];
};

interface DataCenter {
	timestamp: number;
	servers: Server[];
};

function generateData() {
	let data: DataCenter = {} as DataCenter;
	data.timestamp = Math.floor(Date.now() / 1000 - 365 * 24 * 60 * 60);
	data.servers = [];
	for (let i = 0; i < 64; i++) {
		let s: Server = {} as Server;
		s.position = [Math.floor(i / 4) % 4, Math.floor(Math.floor(i / 4) / 4), i % 4];
		s.temperature = Math.floor(Math.random() * 100);
		s.total_cores = Math.floor(Math.random() * 100);
		s.total_memory = Math.floor(Math.random() * 100);
		s.applications = [];
		for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
			let a: Application = {} as Application;
			a.customer = String.fromCharCode(65 + Math.floor(Math.random() * 4));
			a.allocated_cores = Math.floor(Math.random() * 100);
			a.allocated_memory = Math.floor(Math.random() * 100);
			a.utilization = [Math.random(), Math.random(), Math.random()];
			s.applications.push(a);
		}
		data.servers.push(s);
	}
	return data;
}

// Initialize SVG canvas and center it
const svg = d3.select("#app").append("svg")
	.attr("width", 1200)
	.attr("height", 800);



// Create a rectangle for each server from data
svg.selectAll("rect")
	.data(data.servers)
	.enter()
	.append("rect")
	.attr("x", d => d.position[0] * 150 + d.position[2] * 10)
	.attr("y", d => d.position[1] * 150)
	.attr("width", 80)
	.attr("height", 60)
	.attr("fill", d => d3.interpolateReds(d.temperature / 100))
	.attr("stroke", "black");

// Create a circle for each application from data
// svg.selectAll("circle")
// 	.data(data.servers)
// 	.enter()
// 	.append("circle")
// 	.attr("cx", d => d.position[0] * 100 + 40)
// 	.attr("cy", d => d.position[1] * 100 + 30)
// 	.attr("r", 20)
// 	.attr("fill", "blue")
// 	.attr("stroke", "black");

// On hover over server show tooltip with server temperature and utilization
svg.selectAll("rect")
	.on("mouseover", function (event) {
		svg.append("text")
			.attr("id", "tooltip")
			.attr("x", event.target.x.baseVal.value + 40)
			.attr("y", event.target.y.baseVal.value + 30)
			.attr("text-anchor", "middle")
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("font-weight", "bold")
			.attr("fill", "white")
			.text(generateTooltip(event.target.__data__));
	})
	.on("mouseout", function () {
		d3.select("#tooltip").remove();
	});

// On hover over application show tooltip with application data
svg.selectAll("circle")
	.on("mouseover", function (event) {
		console.log(event);
		svg.append("text")
			.attr("id", "tooltip")
			.attr("x", event.target.x.baseVal.value + 40)
			.attr("y", event.target.y.baseVal.value + 30)
			.attr("text-anchor", "middle")
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("font-weight", "bold")
			.attr("fill", "white")
			.text(`${event.target.d.applications.length} apps`);
	})
	.on("mouseout", function () {
		d3.select("#tooltip").remove();
	});

function generateTooltip(s: Server): string {
	let retval = "";
	retval += `Temperature: ${s.temperature}°C<br>`;
	retval += `Total cores: ${s.total_cores}<br>`;
	retval += `Total memory: ${s.total_memory}<br>`;
	retval += `Applications: ${s.applications.length}<br>`;
	return retval;
}

