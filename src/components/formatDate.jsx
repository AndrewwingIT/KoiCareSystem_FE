function formatDate(isoDate) {
  // Parse the date string
  const date = new Date(isoDate);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Format the date
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export default formatDate;
