const express = require("express");
const app = express();
app.use(express.json());

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
  }
};

initializeDBAndServer();

//1.get all details
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    select * from movie order by movie_id;
    `;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//2.insert movie details
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const insertQuery = `
    insert into 
    movie (director_id, movie_name, lead_actor)
    values(${directorId}, '${movieName}', '${leadActor}');
    `;
  const result = await db.run(insertQuery);
  response.send("Movie Successfully Added");
});

//3.get single movie
app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const { director_id, movie_name, lead_actor } = request.body;
  const getMovieQuery = `
  select * from movie where movie_id=${movieId};
  `;
  const result = await db.get(getMovieQuery);
  response.send(result);
});

//4.update movie details
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const { director_id, movie_name, lead_actor } = request.body;
  const updateMovieQuery = `
  update movie
  set
  director_id=${director_id},
  movie_name='${movie_name}',
  lead_actor='${lead_actor}'
  where movie_id=${movieId};
  `;
  const result = await db.get(updateMovieQuery);
  response.send("Movie Details Updated");
});

//5.delete movie
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
  delete from movie where movie_id=${movieId};
  `;
  const result = await db.get(deleteMovieQuery);
  response.send("Movie Removed");
});

//6.get all directors
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    select * from director order by director_id;
    `;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(directorsArray);
});

//7. get director movies
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovieQuery = `
  select movie_name from movie where director_id=${directorId};
  `;
  const result = await db.all(getDirectorMovieQuery);
  response.send(result);
});
module.exports=app;
