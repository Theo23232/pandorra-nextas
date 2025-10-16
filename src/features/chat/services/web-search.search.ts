import {searchWeb} from "@/lib/search";
import {SearchResult} from "@/features/chat/types/chat.types";
import {ChatConfig} from "@/config/chat.config";

export class WebSearchService {
  async search(query: string): Promise<SearchResult[] | string> {

    try {
      return await searchWeb(query)
    } catch (error) {
      return 'Search failed. Please try again.'
    }
  }
  condenseResults(results: SearchResult[]): SearchResult[] {
    return results.slice(0, ChatConfig.MAX_SEARCH_RESULTS).map((result) => ({
      title: result.title,
      snippet:
        result.snippet.substring(0, ChatConfig.MAX_SNIPPET_LENGTH) +
        (result.snippet.length > ChatConfig.MAX_SNIPPET_LENGTH ? '...' : ''),
      link: result.link,
    }))
  }
}
