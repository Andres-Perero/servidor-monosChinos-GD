//scraper-series-currents
import { DataModelerSeries } from "../../modules/DataModeling/DataModelerSeries";
import { downloadChromeExecutableIfNeeded } from "../../resources/dataChrome/getChrome";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const webData = require("../../resources/dataWebPage/webPageInfoMapping.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Método no permitido
  }

  try {
    await downloadChromeExecutableIfNeeded();
    const dataWebPageLibraryFromGD = await getDataGD(
      idFoldersGD.dataWebPage,
      webData.dataWebPage
    );
    const maxNumberPageLibrary = 2
    if (maxNumberPageLibrary) {
      await DataModelerSeries(
        dataWebPageLibraryFromGD,
        maxNumberPageLibrary
      ); //
    }

    res.status(200).json({ data: "Informacion de los mas actuales cargados a la base de datos" });
  } catch (error) {
    console.error("Error al obtener los datos de series:", error);
    res.status(500).json({ error: "Error al obtener los datos de series" });
  }
}
