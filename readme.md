# Pubmed Explorer Search API

This API provide a search endpoint that gives the ability to search within the pubmed dataset which is loaded into Elasticsearch.

The API is created to solve the [Pubmed Explorer Challenge](https://github.com/WaleedJubeh/Pubmed-Explorer-Challenge).

It serves as an explorer for a built dataset from an open-source dataset called Pubmed. The dataset undergoes preprocessing through a cleanup process and field renaming.

[Clone the dataset](https://github.com/WaleedJubeh/ES-Search-App-Dataset)

## Requirements

- The API should be able to send facets.

- Support abstract highlighting based on the user's search input.

- The API returns the top 10 values for each facet based on the
  number of occurrences.

- Support the typeahead feature for facets.

- Support both sort options: Relevance and date sort.

- The facet operator for the authors facet is AND, so if 2 authors are selected, the articles that contain both authors will be returned (Intersect).

- The facet operator for journals and languages facets is OR. So if the user selects 2 journals, the result from both journals will be returned (Union).

- If the user selects a value from a facet with the OR operator, the user should see the other facet options. For example, the journals facet has the values: [A, B, C, D]. If the user selects A, they should have the ability to select B, C, and D.

- The choice in one facet should update the other facets. If the user selects Journal A, the language facet values should be updated to display the languages of the articles in Journal A only.

## Environment file

To test this api locally, make a copy of /config/template.json file and fill all properties inside the template.

The `.env` file is also supported, you can create it, but a small modification to the variables names should be done:
If we want to read the username of elasticsearch, we will read it as ES.USERNAME, in the `.env` file, you have to convert the dot (.) to underscore (\_) so in `.env` file should be ES_USERNAME.

## How to load the dataset.

1. Move the dataset to the /scripts/load-dataset/data

2. Execute the following command:

```
npm run load-dataset
```

## Run

Execute the following command:

```
npm run watch
```
