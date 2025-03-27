import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

// Définir un type pour les résultats de recherche
interface SearchResult {
  title: string
  link: string
  snippet: string
}

export async function searchWeb(
  query: string,
): Promise<SearchResult[] | string> {
  try {
    // Effectuer la recherche DuckDuckGo
    const response = await axios.get(
      `https://html.duckduckgo.com/html/?q=${query}`,
    )

    let data = response.data
    data = data.replace(/\/\/duckduckgo\.com\/l\/\?uddg=/g, "")
    data = data.replace(/%3A%2F%2F/g, "://")
    data = data.replace(/%2F/g, "/")
    data = data.replace(/%2D/g, "-")
    // Charger la page HTML dans Cheerio pour pouvoir l'analyser
    const $: CheerioAPI = load(data)

    // Extraire les résultats de recherche
    const searchResults: SearchResult[] = []
    $(".result").each((index, element) => {
      const title = $(element).find(".result__title").text()
      const link = $(element).find(".result__a").attr("href")
      const snippet = $(element).find(".result__snippet").text()

      // Ajouter les résultats au tableau
      searchResults.push({
        title: title.trim(),
        link: link ? link.trim() : "",
        snippet: snippet.trim(),
      })
    })

    // Si aucun résultat trouvé
    if (searchResults.length === 0) {
      return "No search results found."
    }

    return searchResults
  } catch (error) {
    console.error("Web search error:", error)
    return "Error performing web search."
  }
}
