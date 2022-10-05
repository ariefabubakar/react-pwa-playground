import preval from "preval.macro";
import moment from "moment";

function Footer(props) {
  const version = moment(preval`module.exports = new Date().getTime();`).format(
    "YY.MM.DD.HHmm"
  );

  return <footer style={{ marginTop: 10 }}>Versi {version}</footer>;
}

export default Footer;
