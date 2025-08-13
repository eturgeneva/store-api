--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-12 17:53:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 24600)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    customer_id integer,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24599)
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO postgres;

--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 227
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 229 (class 1259 OID 24612)
-- Name: carts_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts_products (
    cart_id integer,
    product_id integer,
    quantity integer
);


ALTER TABLE public.carts_products OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17099)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(100),
    address character varying(100),
    username character varying(50),
    password character varying(100)
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17098)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 221
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 224 (class 1259 OID 17110)
-- Name: federated_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.federated_credentials (
    id integer NOT NULL,
    customer_id integer,
    provider character varying(100),
    subject character varying(100)
);


ALTER TABLE public.federated_credentials OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17109)
-- Name: federated_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.federated_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.federated_credentials_id_seq OWNER TO postgres;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 223
-- Name: federated_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.federated_credentials_id_seq OWNED BY public.federated_credentials.id;


--
-- TOC entry 231 (class 1259 OID 24628)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer,
    placed_at timestamp without time zone DEFAULT now(),
    status character varying(100)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24627)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 232 (class 1259 OID 24640)
-- Name: orders_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders_products (
    product_id integer,
    order_id integer,
    quantity integer,
    price_cents integer
);


ALTER TABLE public.orders_products OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24579)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100),
    brand character varying(100),
    price_cents integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24578)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 225
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 234 (class 1259 OID 24654)
-- Name: wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    customer_id integer
);


ALTER TABLE public.wishlists OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24653)
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlists_id_seq OWNER TO postgres;

--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 233
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- TOC entry 235 (class 1259 OID 24665)
-- Name: wishlists_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists_products (
    wishlist_id integer,
    product_id integer
);


ALTER TABLE public.wishlists_products OWNER TO postgres;

--
-- TOC entry 4685 (class 2604 OID 24603)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 4682 (class 2604 OID 17102)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 17113)
-- Name: federated_credentials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federated_credentials ALTER COLUMN id SET DEFAULT nextval('public.federated_credentials_id_seq'::regclass);


--
-- TOC entry 4687 (class 2604 OID 24631)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 24582)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 24657)
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- TOC entry 4870 (class 0 OID 24600)
-- Dependencies: 228
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, customer_id, created_at, expires_at) FROM stdin;
3	\N	2025-07-12 11:47:45.679244	2025-10-12 11:47:45
4	9	2025-07-12 11:48:00.347237	2025-10-12 11:48:00
5	\N	2025-07-12 12:02:52.204827	2025-10-12 12:02:52
6	9	2025-07-12 12:03:46.757532	2025-10-12 12:03:46
7	\N	2025-07-12 12:05:18.001572	2025-10-12 12:05:18
8	9	2025-07-12 12:05:34.508664	2025-10-12 12:05:34
9	\N	2025-07-12 12:09:09.401579	2025-10-12 12:09:09
10	9	2025-07-12 12:09:43.309466	2025-10-12 12:09:43
11	\N	2025-07-12 12:11:09.532924	2025-10-12 12:11:09
12	9	2025-07-12 12:11:27.191528	2025-10-12 12:11:27
13	\N	2025-07-12 12:17:33.889398	2025-10-12 12:17:33
14	9	2025-07-12 12:22:59.032614	2025-10-12 12:22:59
15	\N	2025-07-12 12:32:07.581915	2025-10-12 12:32:07
16	\N	2025-07-12 12:34:02.73485	2025-10-12 12:34:02
17	4	2025-07-12 12:35:29.935202	2025-10-12 12:35:29
18	\N	2025-07-12 12:43:39.980185	2025-10-12 12:43:39
19	4	2025-07-12 12:45:20.627553	2025-10-12 12:45:20
20	\N	2025-07-12 12:45:28.234859	2025-10-12 12:45:28
21	\N	2025-07-12 12:49:38.002676	2025-10-12 12:49:38
22	4	2025-07-12 12:50:07.437475	2025-10-12 12:50:07
23	4	2025-07-12 12:50:17.140731	2025-10-12 12:50:17
24	9	2025-07-12 12:50:41.520534	2025-10-12 12:50:41
25	\N	2025-07-17 08:38:49.974731	2025-10-17 08:38:49
26	9	2025-07-17 08:39:18.032593	2025-10-17 08:39:18
27	9	2025-07-17 08:59:25.954768	2025-10-17 08:59:25
28	\N	2025-07-17 10:50:43.606881	2025-10-17 10:50:43
29	9	2025-07-17 10:52:53.672147	2025-10-17 10:52:53
30	\N	2025-07-17 13:55:19.94592	2025-10-17 13:55:19
31	\N	2025-07-17 13:56:04.621108	2025-10-17 13:56:04
32	\N	2025-07-17 14:11:43.307927	2025-10-17 14:11:43
33	\N	2025-07-17 14:13:14.683406	2025-10-17 14:13:14
34	\N	2025-07-17 14:14:56.477968	2025-10-17 14:14:56
35	\N	2025-07-17 14:44:13.191846	2025-10-17 14:44:13
36	\N	2025-07-17 14:45:01.745734	2025-10-17 14:45:01
37	\N	2025-07-17 14:46:21.66696	2025-10-17 14:46:21
38	\N	2025-07-17 14:49:48.985907	2025-10-17 14:49:48
39	\N	2025-07-17 15:05:10.265974	2025-10-17 15:05:10
40	\N	2025-07-17 15:07:21.966669	2025-10-17 15:07:21
41	\N	2025-07-17 15:12:06.149534	2025-10-17 15:12:06
42	9	2025-07-17 15:24:52.979132	2025-10-17 15:24:52
43	\N	2025-07-18 11:40:01.648592	2025-10-18 11:40:01
44	\N	2025-07-18 12:05:02.337778	2025-10-18 12:05:02
45	\N	2025-07-18 12:49:48.180889	2025-10-18 12:49:48
46	\N	2025-07-18 12:53:18.743472	2025-10-18 12:53:18
47	\N	2025-07-18 13:16:02.51399	2025-10-18 13:16:02
48	\N	2025-07-18 13:31:40.539153	2025-10-18 13:31:40
49	\N	2025-07-18 14:04:03.023725	2025-10-18 14:04:03
50	16	2025-07-23 08:22:58.410928	2025-10-23 08:22:58
51	17	2025-07-23 08:34:35.390543	2025-10-23 08:34:35
52	20	2025-07-23 16:51:35.679436	2025-10-23 16:51:35
53	20	2025-07-24 11:45:49.322076	2025-10-24 11:45:49
54	17	2025-07-24 16:26:47.724483	2025-10-24 16:26:47
55	\N	2025-07-24 16:42:11.591573	2025-10-24 16:42:11
56	\N	2025-07-25 10:53:27.493971	2025-10-25 10:53:27
57	20	2025-07-28 10:56:03.42603	2025-10-28 10:56:03
58	\N	2025-07-28 14:43:26.176632	2025-10-28 14:43:26
59	\N	2025-07-28 14:44:51.451895	2025-10-28 14:44:51
60	\N	2025-07-28 14:47:00.39345	2025-10-28 14:47:00
61	\N	2025-07-28 15:09:33.654192	2025-10-28 15:09:33
62	\N	2025-07-28 15:24:31.913098	2025-10-28 15:24:31
63	\N	2025-07-28 15:36:26.986056	2025-10-28 15:36:26
64	\N	2025-07-28 15:37:14.813746	2025-10-28 15:37:14
65	\N	2025-07-28 15:41:33.564034	2025-10-28 15:41:33
66	\N	2025-07-28 16:24:35.324454	2025-10-28 16:24:35
67	\N	2025-07-28 16:29:25.864381	2025-10-28 16:29:25
68	\N	2025-07-28 16:32:15.806726	2025-10-28 16:32:15
69	\N	2025-07-28 19:32:31.412858	2025-10-28 19:32:31
70	\N	2025-07-28 19:36:09.853688	2025-10-28 19:36:09
71	\N	2025-07-28 19:41:14.165421	2025-10-28 19:41:14
72	\N	2025-07-28 19:58:30.554533	2025-10-28 19:58:30
73	\N	2025-07-28 19:59:43.914617	2025-10-28 19:59:43
74	\N	2025-07-29 10:51:57.78905	2025-10-29 10:51:57
75	\N	2025-07-29 10:57:20.448968	2025-10-29 10:57:20
76	\N	2025-07-29 11:02:26.695232	2025-10-29 11:02:26
77	\N	2025-07-29 11:04:23.231339	2025-10-29 11:04:23
78	\N	2025-07-29 11:05:02.129999	2025-10-29 11:05:02
79	\N	2025-07-29 11:08:40.856402	2025-10-29 11:08:40
80	\N	2025-07-29 11:19:15.800739	2025-10-29 11:19:15
81	\N	2025-07-29 11:21:26.538075	2025-10-29 11:21:26
82	\N	2025-07-29 11:24:02.048693	2025-10-29 11:24:02
83	\N	2025-07-29 11:25:58.496434	2025-10-29 11:25:58
84	\N	2025-07-29 11:56:28.669696	2025-10-29 11:56:28
85	\N	2025-07-29 12:00:44.116271	2025-10-29 12:00:44
86	\N	2025-07-29 12:21:10.27655	2025-10-29 12:21:10
87	\N	2025-07-29 12:22:03.907768	2025-10-29 12:22:03
88	\N	2025-07-29 19:21:12.801963	2025-10-29 19:21:12
89	\N	2025-07-29 19:25:51.536523	2025-10-29 19:25:51
90	\N	2025-07-29 19:29:09.587836	2025-10-29 19:29:09
91	\N	2025-07-30 09:30:48.570989	2025-10-30 09:30:48
92	\N	2025-07-30 09:44:41.759222	2025-10-30 09:44:41
93	\N	2025-07-30 10:56:54.555966	2025-10-30 10:56:54
94	\N	2025-07-30 11:01:48.576765	2025-10-30 11:01:48
95	\N	2025-07-30 11:19:53.731334	2025-10-30 11:19:53
96	\N	2025-07-30 11:30:51.461863	2025-10-30 11:30:51
97	\N	2025-07-30 11:48:57.826978	2025-10-30 11:48:57
98	\N	2025-07-30 12:13:40.261058	2025-10-30 12:13:40
99	\N	2025-07-30 12:43:54.468849	2025-10-30 12:43:54
100	\N	2025-07-30 12:45:28.347174	2025-10-30 12:45:28
101	\N	2025-07-30 13:08:46.713211	2025-10-30 13:08:46
102	\N	2025-07-30 13:10:22.776564	2025-10-30 13:10:22
103	\N	2025-07-30 13:11:26.048201	2025-10-30 13:11:26
104	\N	2025-07-30 13:13:08.737388	2025-10-30 13:13:08
105	\N	2025-07-30 13:38:35.23319	2025-10-30 13:38:35
106	\N	2025-07-30 13:39:12.377432	2025-10-30 13:39:12
107	20	2025-07-30 13:53:40.074377	2025-10-30 13:53:40
108	20	2025-07-30 14:37:25.189232	2025-10-30 14:37:25
109	20	2025-07-31 17:23:15.015045	2025-10-31 17:23:15
110	20	2025-08-05 14:40:40.506584	2025-11-05 14:40:40
\.


--
-- TOC entry 4871 (class 0 OID 24612)
-- Dependencies: 229
-- Data for Name: carts_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts_products (cart_id, product_id, quantity) FROM stdin;
44	2	1
44	3	1
44	3	1
44	3	1
44	2	1
44	2	1
44	3	1
44	2	1
46	2	1
46	2	1
46	3	1
46	3	1
46	3	1
46	3	1
46	3	1
46	2	1
46	3	1
46	3	1
46	3	1
46	3	1
46	3	1
46	3	1
46	3	1
46	3	1
47	3	1
47	3	1
47	3	1
47	3	1
47	3	1
47	3	1
48	3	1
48	3	1
48	3	1
48	3	1
48	3	1
48	2	1
48	3	1
48	3	1
48	3	1
48	3	1
49	3	1
50	2	1
51	2	1
51	3	1
52	1	1
52	2	1
53	5	1
53	1	1
53	1	1
53	1	1
53	2	1
53	1	1
53	2	1
53	1	1
53	8	1
54	1	1
55	2	1
55	2	1
55	2	1
55	9	1
56	1	1
56	2	1
56	3	1
56	1	1
56	1	1
56	2	1
56	1	1
56	6	1
\N	1	1
\N	14	1
\N	5	1
\N	1	1
\N	14	1
\N	8	1
\N	11	1
\N	2	1
\N	3	1
\N	2	1
\N	3	1
\N	2	1
\N	2	1
\N	10	1
\N	5	1
\N	1	1
\N	12	1
\N	15	1
\N	3	1
56	15	1
56	3	1
56	11	1
56	13	1
56	19	1
56	5	1
56	15	1
56	9	1
56	14	1
56	12	1
56	11	1
56	3	1
56	12	1
56	5	1
56	10	1
56	11	1
56	5	1
57	1	1
57	1	1
57	5	1
44	4	2
44	4	2
45	4	2
46	4	2
46	4	2
46	4	2
46	4	2
47	4	2
48	4	2
48	4	2
48	4	2
48	4	2
48	4	2
49	4	2
56	4	2
\N	4	2
56	4	2
56	4	2
56	4	2
58	4	2
58	4	1
59	4	2
59	4	1
59	9	2
59	9	1
60	2	2
65	4	6
60	14	4
60	5	1
61	2	2
61	4	3
61	5	-1
61	1	1
94	1	1
92	5	7
65	2	5
65	1	0
64	1	-1
94	2	1
62	2	0
62	1	6
63	2	1
68	1	5
71	3	4
70	2	1
67	2	6
68	5	2
70	3	1
71	4	1
69	4	1
69	2	1
69	3	1
73	1	2
72	2	4
72	3	2
72	5	4
72	8	7
72	4	2
73	4	4
73	2	4
73	8	1
79	3	1
73	9	1
80	4	1
81	3	1
80	1	\N
80	3	\N
81	5	1
81	2	\N
82	3	2
82	5	5
82	4	7
83	2	2
83	8	1
84	2	2
85	2	1
90	4	4
90	6	5
91	4	1
91	6	1
92	4	4
91	5	5
93	1	1
95	4	1
95	3	2
95	1	1
86	2	1
96	2	1
96	3	1
96	4	1
97	1	1
88	2	1
88	3	1
97	3	1
97	2	2
97	8	1
89	1	4
97	9	1
89	3	3
98	3	1
98	4	1
98	5	1
99	1	1
99	2	1
99	3	1
99	4	1
99	5	1
100	6	1
100	7	1
100	8	1
100	9	1
100	10	1
101	1	1
101	2	1
101	3	1
102	1	1
102	2	1
90	2	6
102	3	1
103	1	1
104	3	1
105	1	1
105	2	1
105	3	1
106	6	1
106	7	1
106	8	1
107	1	1
107	2	1
107	3	1
108	5	2
109	8	1
109	9	1
109	10	1
\.


--
-- TOC entry 4864 (class 0 OID 17099)
-- Dependencies: 222
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, first_name, last_name, email, address, username, password) FROM stdin;
5	Evgenii	M	evgesha@mail.com	Str	testUser	12345
9	Vasya	Pupkin	email@mail.com	Awesome str 3	Cat	123
10	\N	\N		\N	\N	
14	\N	\N	m@m.com	\N	\N	123
15	\N	\N	cat@mail.com	\N	\N	12
16	\N	\N	m@mail.com	\N	\N	$2b$15$lvPZeCiQuz1Xe.IqVbJh.uKOQ2KX4./aW6VnnLdN3KbWEJ9rmrS6W
17	\N	\N	em@m.com	\N	\N	$2b$15$kBLDHOitn0tfpjR2/6R1g.5IDu27GkAy3.RiIX8/0o2VKxa70/2zS
4	Elena	Elena	elena.turgeneva@gmail.com	Str 5	Elena Elena	\N
21	e	l	g@mail.com	\N	el	$2b$15$2xoP9ORaiVtfZlmlVM8xuOnHwhkblgwbyl9AeGzo9yO60bm71tw66
22			f@gmail,com	\N		$2b$15$NaLXDUJsw0GsW47lb.T6S.CJGko0VLfSTRc4U041kqBttkIFBus.G
23	F	K	f@mail.com	\N	fk	$2b$15$ZkEygeU6No5OjyOcJrjBD.XxzXTQwefb3m6H2K7rezxmnkj6dVMaO
24	foo	bar	foo@bar.com	\N	foo	$2b$15$XnTdFQG0qo5cMCP8TeebkOx.D22vWH2b.1vALOhkqQhadpn2TZtYq
20	Test	User	user@test.com	Str 562	TestUser	$2b$15$0pb1r35lM43gVL97Gz2Bn.9nO.UUDSQ2hvhOyryfxumhKJigDsYWK
25	e	f	e@mail.com	\N	g	$2b$15$HVdd3mvpYmHsCbIvlL3yM.XMFBLKFLVjGqVHpZ1YOhSq51Fomm3w2
26	e	e	e@m.com	\N	e	$2b$15$cC60I233ZpoWNXBJdXFQiuPt6q7YJyrJLCifJs9IXrBgh5C713dE.
29	e	e	g@m.com	\N	er	$2b$15$JvSXNjf8gSrCs.ejOckeCumAN3.cSA37JYRuSsqY6wbg1YSe.9srO
30	ff	tt	d@mail.com	\N	go	$2b$15$MP6W7hJNjgKEV7H/eIt3ien35pVKkeZDok3n8Gz9EEUhilOG2ckqi
\.


--
-- TOC entry 4866 (class 0 OID 17110)
-- Dependencies: 224
-- Data for Name: federated_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.federated_credentials (id, customer_id, provider, subject) FROM stdin;
4	4	https://accounts.google.com	115598023160007111147
\.


--
-- TOC entry 4873 (class 0 OID 24628)
-- Dependencies: 231
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_id, placed_at, status) FROM stdin;
1	\N	2025-07-30 10:56:58.818353	received
2	\N	2025-07-30 11:01:51.349781	received
3	\N	2025-07-30 11:19:58.499713	received
4	\N	2025-07-30 11:22:45.745182	received
5	\N	2025-07-30 11:25:01.726099	received
6	\N	2025-07-30 11:26:08.453027	received
7	\N	2025-07-30 11:30:57.068243	received
8	\N	2025-07-30 11:49:03.615542	received
9	\N	2025-07-30 12:08:25.074377	received
10	\N	2025-07-30 12:09:19.307019	received
11	\N	2025-07-30 12:13:45.033608	received
12	\N	2025-07-30 12:43:59.740693	received
13	\N	2025-07-30 12:45:34.138654	received
14	\N	2025-07-30 13:08:53.068343	received
15	\N	2025-07-30 13:10:28.005823	received
16	\N	2025-07-30 13:12:43.371477	received
17	\N	2025-07-30 13:13:11.704044	received
18	\N	2025-07-30 13:38:41.945902	received
19	\N	2025-07-30 13:39:16.100489	received
21	20	2025-07-30 14:37:31.107811	received
22	20	2025-07-31 17:24:36.389769	received
20	20	2025-07-30 13:53:47.679632	cancelled
\.


--
-- TOC entry 4874 (class 0 OID 24640)
-- Dependencies: 232
-- Data for Name: orders_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders_products (product_id, order_id, quantity, price_cents) FROM stdin;
1	8	1	1999
2	8	1	1599
3	8	1	1299
1	9	1	1999
2	9	2	1599
3	9	1	1299
1	10	1	1999
2	10	2	1599
9	10	1	1299
3	10	1	1299
8	10	1	799
3	11	1	1299
5	11	1	1499
4	11	1	1299
1	12	1	1999
2	12	1	1599
4	12	1	1299
3	12	1	1299
5	12	1	1499
6	13	1	1599
7	13	1	1999
9	13	1	1299
8	13	1	799
10	13	1	1699
1	14	1	1999
2	14	1	1599
3	14	1	1299
1	15	1	1999
2	15	1	1599
3	15	1	1299
1	16	1	1999
3	17	1	1299
1	18	1	1999
2	18	1	1599
3	18	1	1299
6	19	1	1599
8	19	1	799
7	19	1	1999
1	20	1	1999
3	20	1	1299
2	20	1	1599
5	21	2	1499
8	22	1	799
9	22	1	1299
10	22	1	1699
\.


--
-- TOC entry 4868 (class 0 OID 24579)
-- Dependencies: 226
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, brand, price_cents) FROM stdin;
1	rabbit	Toys Inc.	1999
2	tiger	Plushie Luv	1599
3	coyote	Plushie Luv	1299
4	dog	Toys Inc.	1299
5	hedgehog	Toys Inc.	1499
6	cat	Plushie Luv	1599
7	kangaroo	Joy Toy	1999
8	caterpillar	Plushie Luv	799
9	parrot	Joy Toy	1299
10	lion	Baby Toys	1699
11	shark	Baby Toys	899
12	chicken	Plushie Luv	1199
13	lamb	Toys Inc.	849
14	cow	Baby Toys	2499
15	horse	Toys Inc.	1899
16	crow	Baby Toys	1199
17	frog	Toys Inc.	1299
18	zebra	Plushie Luv	1999
19	anteater	Joy Toy	899
\.


--
-- TOC entry 4876 (class 0 OID 24654)
-- Dependencies: 234
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists (id, customer_id) FROM stdin;
\.


--
-- TOC entry 4877 (class 0 OID 24665)
-- Dependencies: 235
-- Data for Name: wishlists_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists_products (wishlist_id, product_id) FROM stdin;
\.


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 227
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 110, true);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 221
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 30, true);


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 223
-- Name: federated_credentials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.federated_credentials_id_seq', 4, true);


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 22, true);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 225
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 19, true);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 233
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 1, false);


--
-- TOC entry 4703 (class 2606 OID 24606)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4691 (class 2606 OID 17106)
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- TOC entry 4693 (class 2606 OID 17104)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 17108)
-- Name: customers customers_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_username_key UNIQUE (username);


--
-- TOC entry 4697 (class 2606 OID 17115)
-- Name: federated_credentials federated_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federated_credentials
    ADD CONSTRAINT federated_credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 24634)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 24586)
-- Name: products products_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_name_key UNIQUE (name);


--
-- TOC entry 4701 (class 2606 OID 24584)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 24659)
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- TOC entry 4709 (class 2606 OID 24607)
-- Name: carts carts_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4710 (class 2606 OID 24615)
-- Name: carts_products carts_products_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 4711 (class 2606 OID 24620)
-- Name: carts_products carts_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4708 (class 2606 OID 17116)
-- Name: federated_credentials federated_credentials_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.federated_credentials
    ADD CONSTRAINT federated_credentials_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4712 (class 2606 OID 24635)
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4713 (class 2606 OID 24648)
-- Name: orders_products orders_products_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4714 (class 2606 OID 24643)
-- Name: orders_products orders_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4715 (class 2606 OID 24660)
-- Name: wishlists wishlists_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4716 (class 2606 OID 24673)
-- Name: wishlists_products wishlists_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists_products
    ADD CONSTRAINT wishlists_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4717 (class 2606 OID 24668)
-- Name: wishlists_products wishlists_products_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists_products
    ADD CONSTRAINT wishlists_products_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(id);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE customers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.customers TO me;


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE federated_credentials; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.federated_credentials TO me;


-- Completed on 2025-08-12 17:53:37

--
-- PostgreSQL database dump complete
--

