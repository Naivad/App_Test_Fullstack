export interface FlightResponse {
  isSuccess: boolean;
  message: string;
  data: FlightData[];
}

export interface FlightData {
  flightID: number;
  journeyID: number;
  origin: string;
  destination: string;
  isDirect: boolean;
  directDepartureTime: string;
  directArrivalTime: string;
  directCarrier: string;
  directFlightNumber: string;
  directPrice: number;
  flightOrder: number;
  segmentOrigin: string;
  segmentDestination: string;
  segmentDepartureTime: string;
  segmentArrivalTime: string;
  segmentCarrier: string;
  segmentFlightNumber: string;
  segmentPrice: number;
  travelDirection: 'OneWay' | 'Return';
  pathSegments: PathSegment[];
}

export interface PathSegment {
  segmentOrigin: string;
  segmentDestination: string;
  segmentDepartureTime: string;
  directCarrier: string;
  directFlightNumber: string;
}

export interface SearchCriteria {
  origin: string;
  destination: string;
  currency: string;
  type: 'oneway' | 'roundtrip';
  departureDate: string;
  returnDate?: string;
}