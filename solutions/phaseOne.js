const axios = require("axios");

const baseUrl = "https://challenge.crossmint.io";
const candidateId = "bdf28f04-32b9-41e9-862b-9d5d61cc4743";

//calls the API for creating the polyanets at a specific position
async function createPolyanet(row, column) {
  try {
    const response = await axios.post(`${baseUrl}/api/polyanets`, {
      row,
      column,
      candidateId,
    });
    console.log(`Created POLYanet at row ${row}, column ${column}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to create POLYanet at row ${row}, column ${column}`);
    throw error;
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//sets a rate limit for calling the API (otherwise the request can fail)
async function createPolyanetWithRateLimit(row, column, delayMs) {
  await delay(delayMs); // Wait for the specified delay before making the request
  return createPolyanet(row, column);
}

async function createXShapeWithRateLimit(
  centerRow,
  centerColumn,
  size,
  delayMs
) {
  for (let i = -size; i <= size; i++) {
    const row = centerRow + i;
    const col1 = centerColumn - Math.abs(i);
    const col2 = centerColumn + Math.abs(i);

    await createPolyanetWithRateLimit(row, col1, delayMs);
    await createPolyanetWithRateLimit(row, col2, delayMs);
  }
}

async function main() {
  const centerRow = 5;
  const centerColumn = 5;
  const size = 3;

  await createXShapeWithRateLimit(centerRow, centerColumn, size, 2000); // Adjust the delay as needed
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
