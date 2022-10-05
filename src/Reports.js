import {
  Button,
  CircularProgress,
  Box,
  Grid,
  Typography,
  Paper,
  ButtonBase,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

function Reports(props) {
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingAddReport, setLoadingAddReport] = useState(false);
  const [report, setReport] = useState({
    description: "",
  });
  const [newAttachentment, setNewAttachment] = useState({
    file: null,
    fileName: "",
  });
  const [reports, setReports] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const populateReports = async () => {
    try {
      const addReportResult = await axios.get("/api/reports");

      setReports(addReportResult.data);
    } catch (err) {
    } finally {
      setLoadingAddReport(false);
      setLoadingReports(false);
    }
  };

  const handleOnChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnFileInput = (e) => {
    setNewAttachment({ file: e.target.files[0], fileName: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    setLoadingAddReport(true);

    const formData = new FormData();
    formData.append("description", report.description);
    formData.append("attachment", newAttachentment.file);

    try {
      await axios.post("/api/reports", formData, {
        headers: {
          "content-type": "multipart/form-data",
          authorization: "hey",
        },
      });

      enqueueSnackbar("Laporan telah dihantar!", { variant: "success" });
    } catch (err) {
      console.log(err);

      enqueueSnackbar("Laporan akan di hantar apabila 'online'", {
        variant: "warning",
      });
    } finally {
      setReport({
        ...report,
        description: "",
      });
      setNewAttachment({ file: null, fileName: "" });

      setLoadingAddReport(false);

      populateReports();
    }
  };

  useEffect(() => {
    const broadcast = new BroadcastChannel("channelQueuePost");

    broadcast.onmessage = (event) => {
      if (event.data) {
        if (event.data.type === "DONE") {
          populateReports();
        }
      }
    };

    populateReports();
  }, []);

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          marginBottom: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          style={{ margin: "auto" }}
        >
          <Grid item>
            <input
              type="file"
              name="attachment"
              onChange={handleOnFileInput}
              value={newAttachentment.fileName}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Catatan"
              variant="standard"
              value={report.description}
              onChange={handleOnChange}
              name="description"
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleOnClick}
              disabled={!report.description}
              type="submit"
            >
              {loadingAddReport ? (
                <div>
                  <CircularProgress size={12} sx={{ color: "white" }} />{" "}
                  Sending...
                </div>
              ) : (
                "Hantar"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {loadingReports ? (
        <div>
          <CircularProgress size={12} /> Loading...
        </div>
      ) : (
        reports.map((item, index) => (
          <Paper
            sx={{
              p: 2,
              margin: "auto",
              maxWidth: 500,
              flexGrow: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
          >
            <Grid container spacing={2} key={index}>
              <Grid item>
                <ButtonBase sx={{ width: 128, height: 128 }}>
                  <img
                    alt="complex"
                    src={`https://pwa-restapi-scs.herokuapp.com${
                      item.attachment === ""
                        ? "/images/no-image.png"
                        : "/uploaded/" + item.attachment
                    }`}
                    width="128"
                    height="128"
                  />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="div"
                    ></Typography>
                    <Typography variant="body2" gutterBottom>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.createdAt}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{ cursor: "pointer" }}
                      variant="body2"
                    ></Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" component="div"></Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </div>
  );
}

export default Reports;
