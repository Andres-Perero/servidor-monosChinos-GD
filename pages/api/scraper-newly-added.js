//scraper-series-all
import { DataModelerNewlyAdded } from "../../modules/DataModeling/DataModelerNewlyAdded";
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
    const dataWebPageFromGD = await getDataGD(
      idFoldersGD.dataWebPage,
      webData.dataWebPage
    );

    if (dataWebPageFromGD) {
      await DataModelerNewlyAdded(dataWebPageFromGD); //
    }

    res.status(200).json({
      data: "Datos de los capitulos recien agregados, se cargaron en la base de datos",
    });
  } catch (error) {
    console.error("Error al obtener los datos de series:", error);
    res.status(500).json({ error: "Error al obtener los datos de series" });
  }
}
