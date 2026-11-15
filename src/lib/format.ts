export const formatRange = (value: string) => {
  const [start, end] = value.split(" -- ");

  return end && start === end ? start : value.replaceAll(" -- ", " — ");
};

export const formatPublicationVenue = (publication: { publisher: string; venue: string }) =>
    publication.publisher === "Springer Nature Singapore"
      ? `Springer · ${publication.venue}`
      : publication.publisher === "Apple Academic Press"
        ? `Apple Academic Press · ${publication.venue}`
        : `IEEE · ${publication.venue.replace(/^202\d IEEE /, "")}`;

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
