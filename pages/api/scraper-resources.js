//scraper-resources
import { DataModelerResources } from "../../modules/DataModeling/DataModelerResources";
import { downloadChromeExecutableIfNeeded } from "../../resources/dataChrome/getChrome";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const webData  = require("../../resources/dataWebPage/webPageInfoMapping.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Método no permitido
  }
  try {
    //1.- pregunto por el recursos para el propperter
    await downloadChromeExecutableIfNeeded();
    //aca tengo que abrir la base para savar la info de webpage
    const dataWebPageFromGD = await getDataGD(
      idFoldersGD.dataWebPage,
      webData.dataWebPage
    );
    if(dataWebPageFromGD){
      await DataModelerResources(dataWebPageFromGD);
    }
    
    //console.log(dataWebPageFromGD);
    // Envía el objeto con todos los datos en la respuesta
    res.status(200).json({
      data: "Proceso de guardado de los recursos de la pag",
    });
  } catch (error) {
    console.error("Error al obtener los datos de filtros de estado:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los datos de filtros de estado" });
  }
}
