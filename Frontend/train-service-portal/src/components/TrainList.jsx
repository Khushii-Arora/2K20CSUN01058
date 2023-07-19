import React, {useEffect, useState} from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

const TrainList=()=>
{

    const { id } = useParams();

    const [trainData, setTrainData] = useState();
  
    useEffect(() => {
        getTrainData();

      }, []);

    async function getTrainData() {
        try {
          const response = await axios.get(`http://localhost:5000/`);
          const data = response.data;
          setTrainData(data);
        } catch (error) {
          console.error('Error getting data', error);
        }
      }

      if (!trainData) {
        return <CircularProgress />;
      }

   // const { id: todoId, userId, title, completed } = trainData || {};
    // return (
    //   <div>
    //     {trainData ? (
    //       <div>
    //         <h1> {`Todo id: ${todoId}`} </h1>
    //         <h1> {`Todo userId: ${userId}`} </h1>
    //         <h1> {`Todo title: ${title}`} </h1>
    //         <h1> {`Todo completed: ${completed}`} </h1>
    //       </div>
    //     ) : (
    //       <CircularProgress />
    //     )}
    //     <h1>hi</h1>
       
    //   </div>
    // );

    return (
        <div>
          <h1>Train Schedule</h1>
          <div className="table-container">
            <table className="train-table">
              <thead>
                <tr>
                  <th>Train Name</th>
                  <th>Train Number</th>
                  <th>Departure Time</th>
                  <th>Seats Available</th>
                  <th>Price</th>
                  <th>Delayed By (minutes)</th>
                </tr>
              </thead>
              <tbody>
                {trainData.map((train, index) => (
                  <tr key={index}>
                    <td>{train.trainName}</td>
                    <td>{train.trainNumber}</td>
                    <td>{`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}</td>
                    <td>
                      Sleeper: {train.seatsAvailable.sleeper}, AC: {train.seatsAvailable.AC}
                    </td>
                    <td>
                      Sleeper: {train.price.sleeper}, AC: {train.price.AC}
                    </td>
                    <td>{train.delayedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

};

export default TrainList;