const requestURL = "https://starnavi-frontend-test-task.herokuapp.com";

export const gameSettings = async () => {
  try {
    let response = await fetch(requestURL + "/game-settings", {
      method: "GET",
    });
    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка", error);
  }
};

export const winnersGet = async () => {
  try {
    let response = await fetch(requestURL + "/winners", {
      method: "GET",
    });
    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка", error);
  }
};

export const winnersPost = async (body) => {
  try {
    let response = await fetch(requestURL + "/winners", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка", error);
  }
};
