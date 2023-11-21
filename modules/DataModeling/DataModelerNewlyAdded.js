import { scraperNewlyAddedCaps } from "../../compoments/WebScraping/scraperNewlyAddedCaps";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";
import { DataSaveGD } from "../DataSaving/DataSaveGD";
import { DataModelerSerieDetails } from "./DataModelerSerieDetails";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const filesResourcesGD = require("../../resources/dataWebPage/webPageLibrary.json");

const DataModelerNewlyAdded = async (dataWebPageFromGD) => {
  const { webSite } = dataWebPageFromGD;
  // scraping data
  const dataScraperNewlyAddedCaps = await scraperNewlyAddedCaps(webSite);

  if (dataScraperNewlyAddedCaps) {
    // Save
    await DataSaveGD(
      idFoldersGD.newlyAdded,
      filesResourcesGD.newlyAdded,
      dataScraperNewlyAddedCaps
    );
    for (const serie of dataScraperNewlyAddedCaps) {
      // Proceso
      await DataModelerSerieDetails(serie);
    }
    // let newSeries = [];
    // const seriesGD = await getDataGD(
    //   idFoldersGD.dataSeries,
    //   filesResourcesGD.series
    // );

    // if (seriesGD) {
    //   newSeries = dataScraperNewlyAddedCaps.filter(
    //     (ScraperNewlyAddedCap) =>
    //       !seriesGD?.some(
    //         (serieGD) => serieGD.urlSerie === ScraperNewlyAddedCap.urlSerie
    //       )
    //   );

    //   if (newSeries.length > 0) {
    //     console.log("Nuevas series: ", newSeries.length);
    //     for (const serie of newSeries) {
    //       // Proceso
    //       await DataModelerSerieDetails(serie);
    //     }
    //   }
    // }
  }
};

export { DataModelerNewlyAdded };
