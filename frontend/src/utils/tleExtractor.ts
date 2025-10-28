// ===== Two Line Element =====
// 1 25544U 98067A 17352.66420480 .00016717 00000-0 10270-3 0 9003
// 2 25544  51.6357 198.7788 0003099 256.7529 103.3278 15.54194944 10432

// Line one
// Catelog number - 25544U
// Epic Time - 17352.66420480 = 2017 (17) 352nd day (352) 4pm coordinated Universal Time (UTC) (66420480)

// Line two
// Inclination - 51.6357
// Right Ascention of Ascending Node (RAAN) - 198.7788 (Degrees) (Decimal Assumed)
// Eccentricity - 0003099
// Argument of Perigee - 256.7529
// True Anomaly - 103.3278 (Degrees)
// Mean motion - 15.54194944 times in a day
// ==============================================
//

interface TLE {
	satelliteId: number;
	name: string;
	date: string;
	line1: string;
	line2: string;
}
interface TLEExtract {
	line1: Line1;
	line2: Line2;
}

interface Line1 {
	catelogNumber: string;
	epicTime: number;
}
interface Line2 {
	inclination: number;
	rigtAscentionOfAscendingNode: number;
	eccentricity: number;
	argumentOfPerigee: number;
	trueAnomaly: number;
	meanMotion: number;
}
// https://tle.ivanstanojevic.me/api/tle/
function extractTLE(tle: TLE): TLEExtract {
	return {
		line1: extractLineOne(tle),
		line2: extractLineTwo(tle),
	};
}
function extractLineOne(tle: TLE): Line1 {
	const line1 = tle.line1.split(" ");
	return {
		catelogNumber: line1[1],
		epicTime: Number(line1[3]),
	};
}
function extractLineTwo(tle: TLE): Line2 {
	const line2 = tle.line2.split(" ");
	return {
		inclination: Number(line2[2]),
		rigtAscentionOfAscendingNode: Number(line2[3]),
		eccentricity: Number(line2[4]),
		argumentOfPerigee: Number(line2[5]),
		trueAnomaly: Number(line2[6]),
		meanMotion: Number(line2[7]),
	};
}
