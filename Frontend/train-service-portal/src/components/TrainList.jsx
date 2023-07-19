import React, {useEffect, useState} from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Table from 'react-bootstrap/Table';

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

     
    return (
      <div>
        {trainData ? (
            <div>
      <h1>Train Service Port</h1>
      <div className="table-container">
        <Table striped bordered hover id="trains">
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
                <td>{`${train.departureTime.Hours}:${train.departureTime.Minutes}`}</td>
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
        </Table>
      </div>
    </div>
        ) : (
          <CircularProgress />
        )}
       
      </div>
    );

};

export default TrainList;