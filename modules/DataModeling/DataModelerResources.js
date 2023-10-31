import { scraperResourcersWebPage } from "../../compoments/WebScraping/scraperResourcersWebPage";
import { DataSaveGD } from "../DataSaving/DataSaveGD";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const filesResourcesGD = require("../../resources/dataWebPage/webPageLibrary.json");

const DataModelerResources = async (dataWebPageFromGD) => {
  try {
    //local variable
    let category, genre, letter, year, maxPageLibrary;

    // modeling paramenters
    const { webSiteLibrary } = dataWebPageFromGD;

    //1.- scraping data
    const { filterOptions, maxPage } = await scraperResourcersWebPage(
      webSiteLibrary
    );
    //2.- proceso de datos
    if (filterOptions) {
      category = filterOptions.category;
      genre = filterOptions.genre;
      letter = filterOptions.letter;
      year = filterOptions.year;
      maxPageLibrary = maxPage;
    }

    //3.- guardado de datos
    await DataSaveGD(
      idFoldersGD.resourcesWebScraping,
      filesResourcesGD.category,
      category
    );
    await DataSaveGD(
      idFoldersGD.resourcesWebScraping,
      filesResourcesGD.genre,
      genre
    );
    await DataSaveGD(
      idFoldersGD.resourcesWebScraping,
      filesResourcesGD.letter,
      letter
    );
    await DataSaveGD(
      idFoldersGD.resourcesWebScraping,
      filesResourcesGD.year,
      year
    );
    await DataSaveGD(
      idFoldersGD.resourcesWebScraping,
      filesResourcesGD.pagination,
      maxPageLibrary
    );
  } catch (error) {
    console.error("ocurrio algun error:", error);
    return {};
  }
};

export { DataModelerResources };
