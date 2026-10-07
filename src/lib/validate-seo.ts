interface SeoFaqEntry {
  question: string;
  answer: string;
}

interface SeoPageWithFaqs {
  faqs?: readonly SeoFaqEntry[];
}

export function validateSeoFaqParity<
  LocaleName extends string,
  PageName extends string,
>(
  content: Record<LocaleName, { [Page in PageName]: SeoPageWithFaqs }>,
  pageNames: readonly PageName[],
  canonicalLocale: NoInfer<LocaleName>,
): void {
  for (const pageName of pageNames) {
    const canonicalFaqs = content[canonicalLocale][pageName].faqs ?? [];

    if (canonicalFaqs.length === 0) {
      throw new Error(
        `FAQ inválida: a página "${pageName}" não possui matriz em "${canonicalLocale}".`,
      );
    }

    for (const [locale, collection] of Object.entries(content) as [
      LocaleName,
      { [Page in PageName]: SeoPageWithFaqs },
    ][]) {
      const faqs = collection[pageName].faqs ?? [];

      if (faqs.length !== canonicalFaqs.length) {
        throw new Error(
          `FAQ inválida: "${locale}.${pageName}" possui ${faqs.length} entradas; a matriz "${canonicalLocale}" possui ${canonicalFaqs.length}.`,
        );
      }

      for (const [index, faq] of faqs.entries()) {
        if (!faq.question.trim() || !faq.answer.trim()) {
          throw new Error(
            `FAQ inválida: "${locale}.${pageName}" possui pergunta ou resposta vazia na posição ${index + 1}.`,
          );
        }
      }
    }
  }
}
