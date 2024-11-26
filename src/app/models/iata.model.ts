export interface IataResponse {
    isSuccess: boolean;
    message: string;
    data: IataLocation[];
  }
  
  export interface IataLocation {
    iataCode: string;
    cityName: string;
  }