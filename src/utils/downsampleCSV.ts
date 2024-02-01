type CSVData = {
	Timestamp: string;
	'Profit Percentage': string;
};

// just for transparency, this is not completely written by me.
// I have looked at different code and articles, also the paper by Sveinn Steinarsson
// For the sake of doing it fast, I didn't write everything from scratch myself. 
export const LTTB = (data: CSVData[], threshold: number) => {
	let data_length = data.length;
	if (threshold >= data_length || threshold === 0) {
		return data; // Nothing to do
	}

	let sampled = [],
		sampled_index = 0;

	// Bucket size. Leave room for start and end data points
	let every = (data_length - 2) / (threshold - 2);

	let a = 0; // Initially a is the first point in the triangle
	let max_area_point, max_area, area, next_a;

	sampled[sampled_index++] = data[a]; // Always add the first point

	for (let i = 0; i < threshold - 2; i++) {
		// Calculate point average for next bucket (containing c)
		let avg_x = 0,
			avg_y = 0;
		let avg_range_start = Math.floor((i + 1) * every) + 1;
		let avg_range_end = Math.floor((i + 2) * every) + 1;
		avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

		let avg_range_length = avg_range_end - avg_range_start;

		for (; avg_range_start < avg_range_end; avg_range_start++) {
			avg_x += Date.parse(data[avg_range_start]['Timestamp']);
			avg_y += Number.parseFloat(data[avg_range_start]['Profit Percentage']);
		}
		avg_x /= avg_range_length;
		avg_y /= avg_range_length;

		// Get the range for this bucket
		let range_offs = Math.floor((i + 0) * every) + 1,
			range_to = Math.floor((i + 1) * every) + 1;

		// Point a
		let point_a_x = Date.parse(data[a]['Timestamp']); // enforce Number (value may be Date)
		let point_a_y = Number.parseFloat(data[a]['Profit Percentage']);

		max_area = area = -1;

		for (; range_offs < range_to; range_offs++) {
			// Calculate triangle area over three buckets
			area =
				Math.abs(
					(point_a_x - avg_x) *
						(Number.parseFloat(data[range_offs]['Profit Percentage']) - point_a_y) -
						(point_a_x - Date.parse(data[range_offs]['Timestamp'])) *
							(avg_y - point_a_y)
				) * 0.5;
			if (area > max_area) {
				max_area = area;
				max_area_point = data[range_offs];
				next_a = range_offs; // Next a is this b
			}
		}

		sampled[sampled_index++] = max_area_point; // Pick this point from the bucket
		// @ts-ignore
		a = next_a; // This a is the next a (chosen b)
	}

	sampled[sampled_index++] = data[data_length - 1]; // Always add last

	return sampled;
};
