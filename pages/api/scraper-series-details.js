//scraper-series-details

import { DataModelerSerieDetails } from "../../modules/DataModeling/DataModelerSerieDetails";
import { downloadChromeExecutableIfNeeded } from "../../resources/dataChrome/getChrome";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const webDataLibrary = require("../../resources/dataWebPage/webPageLibrary.json");
const webData = require("../../resources/dataWebPage/webPageInfoMapping.json");
const filesResourcesGD = require("../../resources/dataWebPage/webPageLibrary.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Método no permitido
  }

  try {
    await downloadChromeExecutableIfNeeded();

    const seriesGD = await getDataGD(
      idFoldersGD.dataSeries,
      filesResourcesGD.series
    );
    for (const serie of seriesGD) {
      if (!serie.status) {
        console.log("---------------------------------");
        console.log("ID: ", serie.idSerie);
        console.log("Titulo: ", serie.title);
        // Proceso
        await DataModelerSerieDetails(serie);
        console.log("---------------------------------");
      }
    }
    console.log("================================");
    console.log("Series guardadas.");
    console.log("================================");
    res.status(200).json({
      data: "Se realizo un mapeo de todas las series y capitulos de la biblioteca.",
    });
  } catch (error) {
    console.error("Error al obtener los datos de series:", error);
    res.status(500).json({ error: "Error al obtener los datos de series" });
  }
}
