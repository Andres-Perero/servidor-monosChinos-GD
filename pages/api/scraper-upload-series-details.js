//scraper-series-details

import { DataModelerSerieDetails } from "../../modules/DataModeling/DataModelerSerieDetails";
import { downloadChromeExecutableIfNeeded } from "../../resources/dataChrome/getChrome";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const filesResourcesGD = require("../../resources/dataWebPage/webPageLibrary.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Método no permitido
  }

  try {
    await downloadChromeExecutableIfNeeded();
    // Obtener la fecha actual
    const yearCurrent = new Date();
    const seriesGD = await getDataGD(
      idFoldersGD.dataSeries,
      filesResourcesGD.series
    );
    const categories = await getDataGD(
      idFoldersGD.resourcesWebScraping,
      filesResourcesGD.category
    );
    for (const serie of seriesGD) {
      if (serie.status) {
        if (
          serie.year == yearCurrent.getFullYear() &&
          serie.status == categories[categories.length - 1] // aqui selecciono "Estreno" que siempre sera el ultimo elemento de la array
        ) {
          // "estreno  ver como se extrae de manera externa"
          console.log("---------------------------------");
          console.log("ID: ", serie.idSerie);
          console.log("Titulo: ", serie.title);
          // Proceso
          await DataModelerSerieDetails(serie);
        }
      }
    }
    console.log("================================");
    console.log("Series guardadas.");
    console.log("================================");
    res.status(200).json({
      data: "Se realizo un mapeo de las series con Status: Estreno.",
    });
  } catch (error) {
    console.error("Error al obtener los datos de series:", error);
    res.status(500).json({ error: "Error al obtener los datos de series" });
  }
}
