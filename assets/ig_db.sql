-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: interfejsy2
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data_zajec`
--

DROP TABLE IF EXISTS `data_zajec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_zajec` (
  `data_id` int NOT NULL AUTO_INCREMENT,
  `dzien` varchar(255) NOT NULL,
  `nr_lekcji` int NOT NULL,
  `zajecia_id` int NOT NULL,
  PRIMARY KEY (`data_id`),
  KEY `data_zajec_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `data_zajec_zajecia_id_foreign` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_zajec`
--

LOCK TABLES `data_zajec` WRITE;
/*!40000 ALTER TABLE `data_zajec` DISABLE KEYS */;
INSERT INTO `data_zajec` VALUES (1,'Poniedzialek',1,1),(2,'Wtorek',2,1),(3,'Sroda',1,2),(4,'Poniedzialek',2,3);
/*!40000 ALTER TABLE `data_zajec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frekwencja`
--

DROP TABLE IF EXISTS `frekwencja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frekwencja` (
  `zajecia_id` int NOT NULL,
  `user_id` int NOT NULL,
  `data_zajec` date NOT NULL,
  `frekwencja` varchar(255) NOT NULL,
  KEY `frekwencja_user_id_foreign` (`user_id`),
  KEY `frekwencja_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `frekwencja_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `frekwencja_zajecia_id_foreign` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frekwencja`
--

LOCK TABLES `frekwencja` WRITE;
/*!40000 ALTER TABLE `frekwencja` DISABLE KEYS */;
/*!40000 ALTER TABLE `frekwencja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `klasa`
--

DROP TABLE IF EXISTS `klasa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `klasa` (
  `klasa_id` int NOT NULL AUTO_INCREMENT,
  `wychowawca_id` int NOT NULL,
  PRIMARY KEY (`klasa_id`),
  KEY `klasa_wychowawca_id_foreign` (`wychowawca_id`),
  CONSTRAINT `klasa_wychowawca_id_foreign` FOREIGN KEY (`wychowawca_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `klasa`
--

LOCK TABLES `klasa` WRITE;
/*!40000 ALTER TABLE `klasa` DISABLE KEYS */;
INSERT INTO `klasa` VALUES (1,3);
/*!40000 ALTER TABLE `klasa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oceny`
--

DROP TABLE IF EXISTS `oceny`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oceny` (
  `ocena_id` int NOT NULL AUTO_INCREMENT,
  `ocena` int NOT NULL,
  `user_id` int NOT NULL,
  `zajecia_id` int NOT NULL,
  PRIMARY KEY (`ocena_id`),
  KEY `oceny_user_id_foreign` (`user_id`),
  KEY `oceny_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `oceny_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `oceny_zajecia_id_foreign` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oceny`
--

LOCK TABLES `oceny` WRITE;
/*!40000 ALTER TABLE `oceny` DISABLE KEYS */;
/*!40000 ALTER TABLE `oceny` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ogloszenia`
--

DROP TABLE IF EXISTS `ogloszenia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ogloszenia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tytul` varchar(255) NOT NULL,
  `tresc` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ogloszenia`
--

LOCK TABLES `ogloszenia` WRITE;
/*!40000 ALTER TABLE `ogloszenia` DISABLE KEYS */;
INSERT INTO `ogloszenia` VALUES (1,'template','ldasjdlasjdlajdlaksjdlkajdlkasj'),(2,'test2','dolskajdklajdlaskjdlasjkd');
/*!40000 ALTER TABLE `ogloszenia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `przedmioty`
--

DROP TABLE IF EXISTS `przedmioty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `przedmioty` (
  `przedmiot_id` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) NOT NULL,
  PRIMARY KEY (`przedmiot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `przedmioty`
--

LOCK TABLES `przedmioty` WRITE;
/*!40000 ALTER TABLE `przedmioty` DISABLE KEYS */;
INSERT INTO `przedmioty` VALUES (1,'j. Polski'),(2,'Matematyka'),(3,'Biologia'),(4,'Chemia'),(5,'Fizyka'),(6,'Geografia'),(7,'Historia'),(8,'Informatyka'),(9,'j. Angielski'),(10,'j. Niemiecki'),(11,'Muzyka'),(12,'Plastyka'),(13,'WOS'),(14,'Technika'),(15,'Wychowanie fizyczne');
/*!40000 ALTER TABLE `przedmioty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rodzicielstwo`
--

DROP TABLE IF EXISTS `rodzicielstwo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rodzicielstwo` (
  `dziecko_id` int NOT NULL,
  `rodzic_id` int NOT NULL,
  KEY `rodzicielstwo_dziecko_id_foreign` (`dziecko_id`),
  KEY `rodzicielstwo_rodzic_id_foreign` (`rodzic_id`),
  CONSTRAINT `rodzicielstwo_dziecko_id_foreign` FOREIGN KEY (`dziecko_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `rodzicielstwo_rodzic_id_foreign` FOREIGN KEY (`rodzic_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rodzicielstwo`
--

LOCK TABLES `rodzicielstwo` WRITE;
/*!40000 ALTER TABLE `rodzicielstwo` DISABLE KEYS */;
INSERT INTO `rodzicielstwo` VALUES (1,2);
/*!40000 ALTER TABLE `rodzicielstwo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `sala_id` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) NOT NULL,
  PRIMARY KEY (`sala_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (1,'A1'),(2,'A2'),(3,'A3'),(4,'B1'),(5,'B2'),(6,'B3');
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uzytkownik`
--

DROP TABLE IF EXISTS `uzytkownik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uzytkownik` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `imie` varchar(255) NOT NULL,
  `nazwisko` varchar(255) NOT NULL,
  `pesel` varchar(255) NOT NULL,
  `data_urodzenia` date NOT NULL,
  `miasto` varchar(255) NOT NULL,
  `kod_pocztowy` varchar(255) NOT NULL,
  `ulica` varchar(255) NOT NULL,
  `nr_mieszkania` varchar(255) NOT NULL,
  `rola` varchar(255) NOT NULL,
  `klasa_id` int DEFAULT NULL,
  `aktywny` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uzytkownik_email_unique` (`email`),
  KEY `uzytkownik_klasa_id_foreign` (`klasa_id`),
  CONSTRAINT `uzytkownik_klasa_id_foreign` FOREIGN KEY (`klasa_id`) REFERENCES `klasa` (`klasa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uzytkownik`
--

LOCK TABLES `uzytkownik` WRITE;
/*!40000 ALTER TABLE `uzytkownik` DISABLE KEYS */;
INSERT INTO `uzytkownik` VALUES (1,'jan.kowalski@student.dziennikuj.pl','uczen123','Jan','Kowalski','12312312312','2000-05-03','Krakow','30-302','Ludowa','23/3','1',1,1),(2,'joanna.kowalska@rodzic.dziennikuj.pl','rodzic123','Joanna','Kowalska','12312312312','1990-02-01','Krakow','30-302','Ludowa','23/3','2',NULL,1),(3,'pawel.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1),(4,'dominik.mazurek@administrator.dziennikuj.pl','administrator123','Dominik','Mazurek','12312312315','1992-07-12','Krakow','30-307','Lubuska','33/17','4',NULL,1);
/*!40000 ALTER TABLE `uzytkownik` ENABLE KEYS */;
UNLOCK TABLES;

INSERT INTO `uzytkownik` VALUES (6,'pawel1.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel1','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1)
INSERT INTO `uzytkownik` VALUES (6,'pawel2.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel2','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1)

--
-- Table structure for table `wiadomosc`
--

DROP TABLE IF EXISTS `wiadomosc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wiadomosc` (
  `wiadomosc_id` int NOT NULL AUTO_INCREMENT,
  `nadawca_id` int NOT NULL,
  `odbiorca_id` int NOT NULL,
  `typ` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `tytul` varchar(255) NOT NULL,
  `tresc` text NOT NULL,
  `odczytana` tinyint(1) NOT NULL,
  `usunieta` int NOT NULL,
  PRIMARY KEY (`wiadomosc_id`),
  KEY `wiadomosc_nadawca_id_foreign` (`nadawca_id`),
  KEY `wiadomosc_odbiorca_id_foreign` (`odbiorca_id`),
  CONSTRAINT `wiadomosc_nadawca_id_foreign` FOREIGN KEY (`nadawca_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `wiadomosc_odbiorca_id_foreign` FOREIGN KEY (`odbiorca_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wiadomosc`
--

LOCK TABLES `wiadomosc` WRITE;
/*!40000 ALTER TABLE `wiadomosc` DISABLE KEYS */;
/*!40000 ALTER TABLE `wiadomosc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zadanie_domowe`
--

DROP TABLE IF EXISTS `zadanie_domowe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zadanie_domowe` (
  `zadanie_id` int NOT NULL AUTO_INCREMENT,
  `zajecia_id` int NOT NULL,
  `termin_oddania` date NOT NULL,
  `tytul` varchar(255) NOT NULL,
  `opis` text NOT NULL,
  PRIMARY KEY (`zadanie_id`),
  KEY `zadanie_domowe_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `zadanie_domowe_zajecia_id_foreign` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zadanie_domowe`
--

LOCK TABLES `zadanie_domowe` WRITE;
/*!40000 ALTER TABLE `zadanie_domowe` DISABLE KEYS */;
INSERT INTO `zadanie_domowe` VALUES (1,1,'2023-01-15','poeci','napisz poetuw'),(2,2,'2023-01-15','napisz wzur na calke rainmana','prosze skorzystac z materialuw pana doktora ranzego');
/*!40000 ALTER TABLE `zadanie_domowe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zajecia`
--

DROP TABLE IF EXISTS `zajecia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zajecia` (
  `zajecia_id` int NOT NULL AUTO_INCREMENT,
  `przedmiot_id` int NOT NULL,
  `prowadzacy_id` int NOT NULL,
  `sala_id` int NOT NULL,
  `klasa_id` int NOT NULL,
  PRIMARY KEY (`zajecia_id`),
  KEY `zajecia_prowadzacy_id_foreign` (`prowadzacy_id`),
  KEY `zajecia_przedmiot_id_foreign` (`przedmiot_id`),
  KEY `zajecia_klasa_id_foreign` (`klasa_id`),
  KEY `zajecia_sala_id_foreign` (`sala_id`),
  CONSTRAINT `zajecia_klasa_id_foreign` FOREIGN KEY (`klasa_id`) REFERENCES `klasa` (`klasa_id`),
  CONSTRAINT `zajecia_prowadzacy_id_foreign` FOREIGN KEY (`prowadzacy_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `zajecia_przedmiot_id_foreign` FOREIGN KEY (`przedmiot_id`) REFERENCES `przedmioty` (`przedmiot_id`),
  CONSTRAINT `zajecia_sala_id_foreign` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`sala_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zajecia`
--

LOCK TABLES `zajecia` WRITE;
/*!40000 ALTER TABLE `zajecia` DISABLE KEYS */;
INSERT INTO `zajecia` VALUES (1,1,3,1,1),(2,2,3,3,1),(3,3,3,6,1);
/*!40000 ALTER TABLE `zajecia` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-16 21:51:37