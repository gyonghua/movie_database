import sqlite3
import sys
import config
from flask import Flask, jsonify, request, make_response


app = Flask(__name__)
app.config.from_object(config)



@app.route("/movielist", methods=["GET"])
def get_movie_list():
    with sqlite3.connect("movies.db") as conn:
        cur = conn.cursor()
        cur.execute("""
                    SELECT 
                    tmdb_id, movie_title, release_date, poster_link, imdb_id, metascore, indico_sentiment
                    FROM
                    movies
                    """)
        results = cur.fetchall()
        response = []
        for movie in results:
            content = {
                "movie_title" : movie[1],
                "release_date" : movie[2],
                "poster_link" : movie[3],
                "imdb_id" : movie[4],
                "metascore" : movie[5],
                "indico_sentiment" : movie[6] 
            }

            #get genres of movies and add to movie info
            movie_id = movie[0]
            cur.execute("""
                        SELECT 
                        genres.genre_name
                        FROM 
                        movies2genres INNER JOIN genres
                        ON
                        movies2genres.genre_id = genres.genre_id
                        WHERE
                        movies2genres.tmdb_id = ? 
                        """, (movie_id,))
            genres = cur.fetchall()
            content["genres"] = [x[0] for x in genres]

            #get directors of movie and add to movie info
            cur.execute("""
                        SELECT 
                        crews.name
                        FROM 
                        movies2crews INNER JOIN crews
                        ON
                        movies2crews.tmdb_crew_id = crews.tmdb_id
                        WHERE
                        movies2crews.tmdb_movie_id = ? 
                        """, (movie_id,))
            directors = cur.fetchall()
            content["directors"] = [x[0] for x in directors]

            response.append(content)
    
    if True:
        # jsonify(response)

        resp = make_response(jsonify(response), 200)
        resp.headers = {
            "Access-Control-Allow-Origin" : "http://www.yhgoh.com"
        }
        return resp 

@app.route("/movie", methods=["POST", "OPTIONS"])
def insert_movie():
    if request.method =="OPTIONS":
        resp = make_response("received", 200)
        resp.headers = {
                "Access-Control-Allow-Origin" : "null",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
        }
        return resp

    if request.method == "POST":
        try:
            movie_details = {}
            genres = []
            for item in request.json:
                if item["name"] == "genres":
                    genres.append(item["value"])

                else:
                    movie_details[item["name"]] = item["value"]
            
            movie_details["genres"] = genres

            content_for_insertion_to_movies = []
            content_for_insertion_to_movies.append(movie_details["movie_title"])
            content_for_insertion_to_movies.append(movie_details["release_date"])
            content_for_insertion_to_movies.append(movie_details["poster_link"])
            content_for_insertion_to_movies.append(movie_details["imdb_id"])
            content_for_insertion_to_movies.append(int(movie_details["tmdb_id"]))
            content_for_insertion_to_movies.append(int(movie_details["metascore"]))
            content_for_insertion_to_movies.append(float(movie_details["indico_sentiment"]))

            content_for_insertion_to_movies = tuple(content_for_insertion_to_movies)
            with sqlite3.connect("movies.db") as conn:
                cur = conn.cursor()
                cur.execute("""
                            INSERT INTO movies
                            (movie_title, release_date, poster_link, imdb_id, tmdb_id, metascore, indico_sentiment)
                            VALUES
                            (?,DATE(?),?,?,?,?,?)
                            """, content_for_insertion_to_movies)

            genres_for_insertion_to_movies2genres = []
            for genre in movie_details["genres"]:
                tup = (movie_details["tmdb_id"], int(genre))
                genres_for_insertion_to_movies2genres.append(tup)

            with sqlite3.connect("movies.db") as conn:
                cur = conn.cursor()
                cur.executemany("""
                            INSERT INTO movies2genres
                            (tmdb_id, genre_id)
                            VALUES
                            (?,?)
                            """, genres_for_insertion_to_movies2genres)

                content_for_insertion_to_crews = []
                tup = (int(movie_details["director1_tmdb_id"]), movie_details["director1_imdb_id"],movie_details["director_1"])
                content_for_insertion_to_crews.append(tup)

                if movie_details["director_2"]:
                    tup1 = (int(movie_details["director2_tmdb_id"]), movie_details["director2_imdb_id"],movie_details["director_2"])
                    content_for_insertion_to_crews.append(tup2)

                cur.executemany("""
                            INSERT OR IGNORE INTO crews
                            (tmdb_id, imdb_id, name)
                            VALUES
                            (?,?,?)
                            """, content_for_insertion_to_crews)

                content_for_insertion_to_movies2crews = []
                tup2 = (int(movie_details["tmdb_id"]), int(movie_details["director1_tmdb_id"]), "Director")
                content_for_insertion_to_movies2crews.append(tup2)
                if movie_details["director_2"]:
                    tup3 = (int(movie_details["tmdb_id"]), int(movie_details["director2_tmdb_id"]), "Director")
                    content_for_insertion_to_movies2crews.append(tup3)

                cur.executemany("""
                            INSERT INTO movies2crews
                            (tmdb_movie_id, tmdb_crew_id, job)
                            VALUES
                            (?,?,?)
                            """, content_for_insertion_to_movies2crews)

            resp = make_response("received", 201)
            resp.headers = {
                    "Access-Control-Allow-Origin" : "http://www.yhgoh.com",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
            }
            return resp

        except sqlite3.Error as e:
            resp = make_response(str(e), 500)
            resp.headers = {
                    "Access-Control-Allow-Origin" : "http://www.yhgoh.com",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
            }
            return resp


@app.route("/movieTest", methods=["POST", "OPTIONS"])
def insert_movieTest():
  
    print(str(request.json), file=sys.stderr)

    resp = make_response("received", 200)
    resp.headers = {
            "Access-Control-Allow-Origin" : "http://www.yhgoh.com",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"

        }
    return resp
if __name__ == "__main__":
    app.run()