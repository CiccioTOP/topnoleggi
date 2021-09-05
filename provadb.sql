-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Giu 29, 2021 alle 11:06
-- Versione del server: 10.4.19-MariaDB
-- Versione PHP: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `provadb`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `tipo_utente` int(2) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `data_nascita` date NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `cf` varchar(50) NOT NULL,
  `patente` varchar(50) NOT NULL,
  `regione` varchar(100) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `comune` varchar(100) NOT NULL,
  `carta` varchar(100) NOT NULL,
  `mese` varchar(50) NOT NULL,
  `cvv` int(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`tipo_utente`, `nome`, `cognome`, `data_nascita`, `telefono`, `cf`, `patente`, `regione`, `provincia`, `comune`, `carta`, `mese`, `cvv`, `email`, `password`) VALUES
(0, 'Dario', 'Birtone', '2021-06-01', '1111111111', 'BRTDRA98B04G273B', 'B', 'Puglia', '', '', '1111222233334444', '2021-02', 123, 'dariobirtone@icloud.com', '8d1b3b6757a91b427bbfa1d672d367a0ff01273bf91af59acd43cf1f2e8e7d5a99aa13e59207e51c0b40c672fa167201aa9279bb889c63ec93acff8e72f2e86a'),
(1, 'dddd', 'Birt', '2021-06-02', '3290462060', 'BRTDRA98B04G273B', 'B', 'Marche', '', '', '1111222233334444', '2021-03', 123, 'Dario1233@aaaaa.itAAAAAcvc', 'fd4b1c022776b486bd6f9044fb77eb06c708f50082f1f433d63b331faa2cc2e5dbdd699bec8ca92f2dc90b4c870edaaad25645c7211fc71012f5d60025b7a308');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
