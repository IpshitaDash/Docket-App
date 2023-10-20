import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import * as XLSX from "xlsx";

const styles = {
    form: {
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid",
      borderRadius: "5px",
      backgroundColor: "#f9f9f9",
    },
    formControl: {
      width: "100%",
      marginBottom: "20px",
    },
    button: {
      marginTop: "10px",
    backgroundColor: "#007bff",
      color: "#fff",
    },
    table: {
      marginBottom: "20px",
    backgroundColor: "#fff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    tableCell: {
      fontWeight: "bold",
      color: "#007bff",
    },
  };
  

function DocketForm() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [supplierNames, setSupplierNames] = useState([]);
  const [poNumbers, setPONumbers] = useState([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [xlsData, setXLSData] = useState([]);
  const [tableData, setTableData] = useState([]);



  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedHours = parseInt(hoursWorked, 10);
    if (isNaN(parsedHours)) {
      alert("Please enter a valid integer for 'No. of hours worked'.");
      return;
    }

    const parsedRate = parseFloat(ratePerHour);
    if (isNaN(parsedRate)) {
      alert("Please enter a valid rate for 'Rate per hour'.");
      return;
    }

    const newRow = {
      Name: name,
      "Start Time": startTime,
      "End Time": endTime,
      "Hours Worked": hoursWorked,
      "Rate per Hour": ratePerHour,
      "Supplier Name": supplierName,
      "Purchase Order": purchaseOrder,
      "Description": selectedDescriptions.join(", "),
    };
    setTableData([...tableData, newRow]);


    setName("");
    setStartTime("");
    setEndTime("");
    setHoursWorked("");
    setRatePerHour("");
    setSupplierName("");
    setPurchaseOrder("");
    setSelectedDescriptions([]);

  };

  const readXLSXFile = async (file) => {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = (e) => {
        const arrayBuffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(parsedData);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    const inputFile = document.getElementById("fileInput");

    inputFile.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const xlsData = await readXLSXFile(file);
          console.log(xlsData);
        } catch (error) {
          console.error(error);
        }
      }
    });
  });

  const handlePurchaseOrderChange = (e) => {
    const selectedPO = e.target.value;
    const descriptions = xlsData
      .filter((row) => row[2].trim() === selectedPO)
      .map((row) => row[15].trim()); 
    setSelectedDescriptions(descriptions);
    console.log(
      "🚀 ~ file: DocketForm.js:96 ~ handlePurchaseOrderChange ~ descriptions:",
      descriptions
    );
    setPurchaseOrder(selectedPO);
  };

  const handleSupplierChange = (e) => {
    setSupplierName(e.target.value);

    const selectedSupplier = e.target.value;
    const filteredPONumbers = xlsData
      .filter((row) => row[11].trim() === selectedSupplier) 
      .map((row) => row[1].trim());

    const uniquePONumbers = [...new Set(filteredPONumbers)];
    setPONumbers(uniquePONumbers);
  };

  useEffect(() => {
    fetch("/export29913.xlsx")
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: "",
        });

        setXLSData(rawData); 

        const supplierNames = rawData
          .slice(1)
          .map((row) => row[11].trim())
          .filter((name) => name);

        const uniqueSupplierNames = [...new Set(supplierNames)];
        setSupplierNames(uniqueSupplierNames);
      });
  }, []);

  return (
    <Grid >
      <Grid item xs={12}>
        <Typography variant="h4" justifyContent='center'>
          Create a DOCKET
        </Typography>
        <Paper elevation={3} style={styles.form}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.formControl}
              required
            />
            <TextField
              label="Start time"
              variant="outlined"
              type="time"
              value={startTime}
              inputProps={{ step: 300 }}
              onChange={(e) => setStartTime(e.target.value)}
              style={styles.formControl}
              required
            />
            <TextField
              label="End time"
              variant="outlined"
              type="time"
              inputProps={{ step: 300 }}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={styles.formControl}
              required
            />
            <TextField
              label="No. of hours worked"
              variant="outlined"
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              style={styles.formControl}
              required
            />
            <TextField
              label="Rate per hour"
              variant="outlined"
              type="number"
              value={ratePerHour}
              onChange={(e) => setRatePerHour(e.target.value)}
              style={styles.formControl}
              required
            />
            <FormControl variant="outlined" style={styles.formControl}>
              <InputLabel>Supplier Name</InputLabel>
              <Select
                value={supplierName}
                onChange={handleSupplierChange}
                label="Supplier Name"
              >
                {supplierNames.map((supplier, index) => (
                  <MenuItem key={index} value={supplier}>
                    {supplier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" style={styles.formControl}>
              <InputLabel>Purchase Order</InputLabel>
              <Select
                value={purchaseOrder}
                onChange={handlePurchaseOrderChange}
                label="Purchase Order"
              >
                {poNumbers.map((po, index) => (
                  <MenuItem key={index} value={po}>
                    {po}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <Typography variant="h6">Descriptions</Typography>
              <List>
                {selectedDescriptions.map((description, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`- ${description}`} />
                  </ListItem>
                ))}
              </List>
            </div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={styles.button}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Table Page
        </Typography>
        <TableContainer component={Paper} style={styles.table}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(tableData[0] || {}).map((header, index) => (
                  <TableCell key={index} style={styles.tableCell}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((value, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {value && value.length > 0 ? value : "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default DocketForm;
