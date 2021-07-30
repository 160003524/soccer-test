CREATE SEQUENCE public.t_player_id_player_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE public.t_team_id_team_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE public.user_id_user_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE public.t_player
(
    id_player integer NOT NULL DEFAULT nextval('t_player_id_player_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    age integer NOT NULL,
    team_id integer NOT NULL,
    squad_number integer NOT NULL,
    "position" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nationality character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT t_player_pkey PRIMARY KEY (id_player),
    CONSTRAINT fk_team_player FOREIGN KEY (team_id)
        REFERENCES public.t_team (id_team) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

CREATE TABLE public.t_team
(
    id_team integer NOT NULL DEFAULT nextval('t_team_id_team_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    league character varying(50) COLLATE pg_catalog."default" NOT NULL,
    country character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT t_team_pkey PRIMARY KEY (id_team)
)

CREATE TABLE public.t_user
(
    id_user integer NOT NULL DEFAULT nextval('user_id_user_seq'::regclass),
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id_user),
    CONSTRAINT unique_user_correo UNIQUE (email)
)


CREATE OR REPLACE FUNCTION public.f_createt_player(
	s_name character varying,
	s_age integer,
	s_team_id integer,
	s_squad_number integer,
	s_position character varying,
	s_nationality character varying,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
 BEGIN

 INSERT INTO t_player(id_player, name, age,team_id,squad_number,position,nationality)
 VALUES (nextval('t_player_id_player_seq'::regclass),  s_name, s_age, s_team_id,s_squad_number,s_position,s_nationality);

 respuesta := 'INSERCION EXITOSA';
 rest := 1;
 RETURN;
EXCEPTION WHEN OTHERS THEN
GET STACKED DIAGNOSTICS respuesta = PG_EXCEPTION_DETAIL;
rest := 2;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_createt_team(
	s_name character varying,
	s_league character varying,
	s_country character varying,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
 BEGIN

 INSERT INTO t_team(id_team, name, league, country)
 VALUES (nextval('t_team_id_team_seq'::regclass),  s_name, s_league, s_country);

 respuesta := 'INSERCION EXITOSA';
 rest := 1;
 RETURN;
EXCEPTION WHEN OTHERS THEN
GET STACKED DIAGNOSTICS respuesta = PG_EXCEPTION_DETAIL;
rest := 2;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_createt_user(
	s_email character varying,
	s_password character varying,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
 BEGIN

 INSERT INTO t_user(id_user, email, password)
 VALUES (nextval('user_id_user_seq'::regclass),  s_email, s_password);

 respuesta := 'INSERCION EXITOSA';
 rest := 1;
 RETURN;
EXCEPTION WHEN OTHERS THEN
GET STACKED DIAGNOSTICS respuesta = PG_EXCEPTION_DETAIL;
rest := 2;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_deletet_player(
	s_id_player numeric,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
cont_player numeric;
id_return numeric;
 BEGIN
 SELECT COUNT (*) INTO cont_player FROM t_player WHERE id_player = s_id_player;
 IF cont_player = 1 THEN

 DELETE FROM t_player where t_player.id_player = s_id_player;
 respuesta := 'ELIMINACIÓN EXITOSA';
 rest := 1;
 ELSE
 respuesta := 'No se encuentra la factura';
 rest := 2;
 END IF;
 RETURN;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_deletet_team(
	s_id_team numeric,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
cont_team numeric;
id_return numeric;
 BEGIN
 SELECT COUNT (*) INTO cont_team FROM t_team WHERE id_team = s_id_team;
 IF cont_team = 1 THEN

 DELETE FROM t_player AS tp
 USING t_team AS tt
 WHERE tt.id_team = tp.id_player AND tt.id_team = s_id_team;

 SELECT DISTINCT ON (id_team) id_team INTO id_return FROM t_team WHERE id_team = s_id_team;

 DELETE FROM t_team AS tt
 WHERE tt.id_team = id_return;
 respuesta := 'ELIMINACIÓN EXITOSA';
 rest := 1;
 ELSE
 respuesta := 'No se encuentra la factura';
 rest := 2;
 END IF;
 RETURN;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_read_email_user(
	s_email character varying)
    RETURNS SETOF t_user
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
 BEGIN
 RETURN QUERY
 SELECT * FROM t_user WHERE t_user.email = s_email;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_readt_player_id(
	s_id_player numeric)
    RETURNS SETOF t_player
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
 BEGIN
 RETURN QUERY
 SELECT * FROM t_player WHERE t_player.id_player = s_id_player;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_readt_team_id(
	s_id_team numeric)
    RETURNS SETOF t_team
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
 BEGIN
 RETURN QUERY
 SELECT * FROM t_team WHERE t_team.id_team = s_id_team;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_readt_user_id(
	s_id_user numeric)
    RETURNS SETOF t_user
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
 BEGIN
 RETURN QUERY
 SELECT * FROM t_user WHERE t_user.id_user = s_id_user;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_updatet_player(
	s_id_player numeric,
	s_name character varying,
	s_age integer,
	s_team_id integer,
	s_squad_number integer,
	s_position character varying,
	s_nationality character varying,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
cont_player numeric;
 BEGIN
 SELECT COUNT (*) INTO cont_player FROM t_player WHERE id_player = s_id_player;
 IF cont_player = 1 THEN
 UPDATE t_player
 SET name = COALESCE(s_name, t_player.name),
     age = COALESCE(s_age, t_player.age),
    team_id = COALESCE(s_team_id, t_player.team_id),
	 squad_number = COALESCE(s_squad_number, t_player.squad_number),
	  position = COALESCE(s_position, t_player.position),
	   nationality = COALESCE(s_nationality, t_player.nationality)
WHERE id_player = s_id_player;
 respuesta := 'ACTUALIZACION EXITOSA';
 rest := 1;
 ELSE
 respuesta := 'No se encuentra el jugador';
 rest := 2;
 END IF;
 EXCEPTION WHEN OTHERS THEN
 GET STACKED DIAGNOSTICS respuesta = PG_EXCEPTION_DETAIL;
 rest := 2;
 RETURN;
 END;
$BODY$;

CREATE OR REPLACE FUNCTION public.f_updatet_team(
	s_id_team numeric,
	s_name character varying,
	s_league character varying,
	s_country character varying,
	OUT respuesta character varying,
	OUT rest numeric)
    RETURNS record
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
cont_team numeric;
 BEGIN
 SELECT COUNT (*) INTO cont_team FROM t_team WHERE id_team = s_id_team;
 IF cont_team = 1 THEN
 UPDATE t_team
 SET name = COALESCE(s_name, t_team.name),
     league = COALESCE(s_league, t_team.league),
     country = COALESCE(s_country, t_team.country)
WHERE id_team = s_id_team;
 respuesta := 'ACTUALIZACION EXITOSA';
 rest := 1;
 ELSE
 respuesta := 'No se encuentra el equipo';
 rest := 2;
 END IF;
 EXCEPTION WHEN OTHERS THEN
 GET STACKED DIAGNOSTICS respuesta = PG_EXCEPTION_DETAIL;
 rest := 2;
 RETURN;
 END;
$BODY$;