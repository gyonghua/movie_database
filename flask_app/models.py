from peewee import *

database = SqliteDatabase('movies.db', **{})

class BaseModel(Model):
    class Meta:
        database = database

class Crews(BaseModel):
    imdb = TextField(db_column='imdb_id', null=True, unique=True)
    name = TextField(null=True)
    tmdb = PrimaryKeyField(db_column='tmdb_id', null=True)

    class Meta:
        db_table = 'crews'

class Genres(BaseModel):
    genre = PrimaryKeyField(db_column='genre_id', null=True)
    genre_name = TextField()

    class Meta:
        db_table = 'genres'

class Movies(BaseModel):
    imdb = TextField(db_column='imdb_id', null=True, unique=True)
    indico_sentiment = FloatField(null=True)
    metascore = IntegerField(null=True)
    movie = PrimaryKeyField(db_column='movie_id', null=True)
    movie_title = TextField()
    poster_link = TextField(null=True)
    release_date = TextField()
    tmdb = IntegerField(db_column='tmdb_id', null=True, unique=True)

    class Meta:
        db_table = 'movies'

class Movies2Crews(BaseModel):
    job = TextField(null=True)
    tmdb_crew = ForeignKeyField(db_column='tmdb_crew_id', null=True, rel_model=Crews, to_field='tmdb')
    tmdb_movie = ForeignKeyField(db_column='tmdb_movie_id', null=True, rel_model=Movies, to_field='tmdb')

    class Meta:
        db_table = 'movies2crews'
        indexes = (
            (('tmdb_movie', 'tmdb_crew'), True),
        )
        primary_key = CompositeKey('tmdb_crew', 'tmdb_movie')

class Movies2Genres(BaseModel):
    genre = ForeignKeyField(db_column='genre_id', null=True, rel_model=Genres, to_field='genre')
    tmdb = ForeignKeyField(db_column='tmdb_id', null=True, rel_model=Movies, to_field='tmdb')

    class Meta:
        db_table = 'movies2genres'
        indexes = (
            (('tmdb', 'genre'), True),
        )
        primary_key = CompositeKey('genre', 'tmdb')

