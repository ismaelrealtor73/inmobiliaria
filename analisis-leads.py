import csv, sys, io, re
from collections import Counter
from datetime import datetime

data = """Creado,Nombre,Correo electrónico,Origen,Formulario,Canal,Estado,Propietario,Etiquetas,Teléfono,Número de teléfono secundario,Número de WhatsApp
06/02/2026 6:22am,Manuel Barba Rodriguez,manolo_colmenar@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34627636321,,
06/01/2026 11:30pm,Hamburgueseria Las Niñas,elena141209@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34646988343,,
06/01/2026 8:35am,Christina  Law,whats-cooking@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34687498651,,
06/01/2026 8:06am,Jose Rojo Rojo,josemanuelsansev@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34608262167,,
06/01/2026 6:19am,CATRINA BEACH BAR,sevennerja@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34657680559,,
05/31/2026 11:00pm,Victor Manuel Ballesteros Gambero,vgambero@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34680521091,,
05/31/2026 4:41am,Valdirenny Lima,valdirenel@icloud.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+346353117029,,
05/30/2026 2:47am,Angel,hola@angelrielo.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,629590406,,
05/29/2026 2:13am,Fernando Vallejo Fontalba,fernan_harley@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34661623632,,
05/28/2026 11:19am,Jose Ramon Castillo Espejo,aguardenteros@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34656183458,,
05/28/2026 10:25am,Fran Fernández Alba,restaurante.arxiduna@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34744612916,,
05/27/2026 8:40am,Roman Santiago Giles,Jamesromanmanuela@icloid.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34609023487,,
05/27/2026 7:13am,Antonio Boraita Cordero,aboraitacordero@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34665079868,,
05/27/2026 4:40am,Amparo Fuentes Fuentes,info@typicalspanish.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34645040645,,
05/27/2026 4:26am,Lapiz Acezino Tattoo,lapizasesinotattoo@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34655211200,,
05/26/2026 10:17am,Paco Trevi,restpizztrevi@yahoo.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34609402822,,
05/25/2026 10:10pm,Gert de Lange,ghdelange@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34666777888,,
05/25/2026 4:38pm,Vimpi Martinez,nuevomanhattan@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34677112346,,
05/25/2026 3:56pm,David Ruiz guerrero,yujitgf@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34635324584,,
05/25/2026 11:45am,Jumar Sport MarisaMarin,diseno@jumarsport.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34609422216,,
05/25/2026 6:27am,Enrique Javier Izquierdo Chavero,enjavi10@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34636780259,,
05/25/2026 3:50am,David Cibreiro,Info@southcoastcustomz.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34671768971,,
05/25/2026 2:22am,Juan Aguilar Gamez,juanaguilargamez2010@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34687988972,,
05/24/2026 3:52pm,Emilia Pardeza garcia,emiliapardeza@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34657993890,,
05/24/2026 12:58pm,Jose Antonio Moralo Alvarez,Centrolimp@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34600999899,,
05/24/2026 7:10am,Inma Corpas,inmacorpa75@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34616503657,,
05/22/2026 6:52am,Eva Maria Moreno Romero,Evanerea2710@gmail.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34651458563,,
05/21/2026 10:38am,Loli Anaya Ayllon,lolianayaayllon@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34676920649,,
05/21/2026 8:50am,Don Vitto,cafeteriadonvitto@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,613243221,,
05/20/2026 9:18am,Pubpepejohns Mollina,morillajaime61@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34687081134,,
05/19/2026 2:56pm,Eduardo,admin@papeleriaofimat.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,663729311,,
05/19/2026 8:05am,Arantxa Ruiz Mérida,arantxaruiz@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34675612891,,
05/19/2026 7:19am,Bonifacio Pascual Sánchez,casapascual.50@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34664424936,,
05/18/2026 10:06am,gilberto,gbraglia@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34646228280,,
05/18/2026 9:24am,Miguel Angel Torres,torreslowcost@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34649040418,,
05/18/2026 4:50am,Benito Rueda,djbeni_20@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34630144976,,
05/17/2026 1:08pm,Francisco Ramon Girona Ramos,frandelmarchal.fg@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34616240150,,
05/17/2026 11:37am,Piaf Sevilla,margaritapiaf@yahoo.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34657536392,,
05/17/2026 10:11am,Juan Carlos García,jonhchords662@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34646229171,,
05/16/2026 11:53pm,Ecofamily 5D Málaga,ecofamily5d@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,673805262,,
05/16/2026 12:26am,Jose Maria Maldonado Martin,showroom@hotmail.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34651182529,,
05/15/2026 2:08pm,Miguel Parejo Planell,ganaderiamiguelparejo@hotmail.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34608667028,,
05/15/2026 12:22pm,Daniel Fredes,danielfredes_@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34696721848,,
05/15/2026 11:19am,Zoran Rakovic,rakovic@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34653257767,,
05/15/2026 11:08am,Esteban Gavilán Jiménez,charogalvinmorales@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34613742574,,
04/23/2026 10:57am,Rafael Vera,rafaelveralopez@yahoo.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34647555115,,
04/23/2026 9:54am,María giron,mariagiron86@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,635141053,,
04/22/2026 8:28am,carmen.r.campuzano@gmail.com,infinitycamplaunion@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34614615760,,
04/20/2026 7:02pm,Justo Ortiz Gonzalez,justortizgonzalez@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34624296236,,
04/20/2026 8:47am,Mariangeles Jiménez Muñoz,mariangelesjimenez82@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34653178783,,
04/20/2026 6:31am,Laura Liberatori,laesquinadelaura@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,613304167,,
04/20/2026 12:43am,Antonio Pucci,pizzaconsul@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34675068692,,
04/20/2026 12:37am,Juan Antonio Ramírez López,jrllamar2@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34660989403,,
04/19/2026 8:43am,Jose Gomez Ruiz,josegomez.963@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34651884921,,
04/19/2026 8:41am,Antonio Sánchez,a.sandre1958@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34696763007,,
04/18/2026 10:34am,Bar Morente,jm.morente.linares@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34639413091,,
04/18/2026 10:33am,Yan Popov,yanko2510@yahoo.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34680195059,,
04/18/2026 10:30am,Antonio Carmona,karmana35@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34654759815,,
04/17/2026 3:41pm,Sonia Fernandez Cabello,koketagroup@yahoo.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34652440144,,
04/16/2026 3:51am,Saman Haghkar,lotus1steakhouse@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34673432288,,
04/15/2026 7:34am,Lucy Zapata Cabrera,lucy.ar@live.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34698957226,,
04/15/2026 7:10am,Jose Manuel Clares Perales,bibajoy@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34686221256,,
04/14/2026 6:04am,Jose Maria Laguna Morales,hr.lamina@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34670553068,,
04/13/2026 10:24pm,Dora Ortiz,dora_hof@hotmail.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34692109164,,
04/13/2026 2:07pm,Javier Segura Martin,p.poniente@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34695903138,,
04/12/2026 2:40am,Jose Aguilar,carnicasaguilar@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34696231972,,
04/11/2026 6:43am,Justo Martinez Y Julio Fagundes,justoyjuliopeluqueria@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34672245993,,
04/10/2026 5:15am,Alicia Cotrina Morales,aliciacotrina@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34667700055,,
04/09/2026 4:23pm,Manuel Benítez Ginés,dismabe@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34630918090,,
04/09/2026 3:01pm,Juan Antonio Ramirez Galisteo,jramirezgalisteo@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34651012293,,
04/09/2026 2:10pm,Astrid Sanchez,rotove@yahoo.com.mx,De pago,1_SG_Captación_leads-locales,Correo electrónico,CONTACTADOS,Unassigned,,+34600924583,,
04/09/2026 1:57pm,M_y_Dubai_Es,Michellicavalcante@iclou.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34677846523,,
04/09/2026 10:18am,Irina Dumitru,crisiritoledo@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34606247613,,
04/09/2026 1:06am,Cynthia Janin,cynthiajanin@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,CONTACTADOS,Unassigned,,+34624585270,,
04/08/2026 11:06pm,AS beauty,audsellem@yahoo.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,0034632919445,,
04/07/2026 2:58pm,Leon Pescaru,leoncatalinpescaru@hotmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34673718965,,
04/07/2026 6:32am,Manuel Zamorano,manu-2658@hotmail.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,CONTACTADOS,Unassigned,,+34631361518,,
04/07/2026 12:56am,Cristobal Palacios,palaciosrecamales@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34654663721,,
04/06/2026 8:35am,Sohail,suail_morenazo16@hotmail.es,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34689539351,,
04/03/2026 7:17pm,julio,axajulio1@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,CONTACTADOS,Unassigned,,+34633778082,,
04/03/2026 9:14am,Ignacio Moreno,Moreno@imoreno.tv,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34617328132,,
04/03/2026 2:53am,EL BODEGÓN KALIDAD | Restaurante Asador,Elbodegonkalidad@gmail.com.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34640250891,,
04/02/2026 9:33am,赖建平,laizhou1978@icloud.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,NO INTERESA PERO SI BUSCA,Unassigned,,+34722251818,,
04/01/2026 1:17pm,Singh Baljit,singhbaljitbaljitsingh648@gmail.com,De pago,1_SG_Captación_leads-locales,Correo electrónico,Registrado,Unassigned,,+34632462072,,
03/28/2026 8:06am,Mili Benitez,mili@anilhometrends.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34651838489,,
03/27/2026 6:29am,Gert de Lange,ghdelange@hotmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34666777888,,
03/27/2026 4:54am,Lisandro Matheus,lisandromatheus@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34640834321,,
03/25/2026 10:23am,Noelia  Pintos,Noepintos55@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34613404869,,
03/25/2026 7:51am,Elsa Harges,Helsaheimer@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,CONTACTADOS,Unassigned,,+34687255268,,
03/24/2026 7:06pm,Daniel Francescangeli,danielrolando66@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34622237022,,
03/20/2026 11:52am,Antonio Rivera Pino,antoniorivera595@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34652906755,,
03/19/2026 1:06pm,Juan López Godoy,juandemondron@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,CONTACTADOS,Unassigned,,+34686486973,,
03/19/2026 12:29pm,Raisa Rog,raisa8011@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34675343389,,
03/19/2026 8:53am,Inma Moreno Galiano,mir.fer99@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34670745471,,
03/18/2026 1:25pm,Jesús grande,jgmceuta@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34689123135,,
03/18/2026 10:09am,Belen Sanchez,lunamora28@hotmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34647980027,,
03/16/2026 4:52pm,Eimy Urbaneja,eimyurbaneja@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34640992508,,
03/16/2026 1:59pm,Paco Trevi,celiamacias05@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,CONTACTADOS,Unassigned,,+34609402822,,
03/16/2026 1:07pm,Nicu Muntean,nickmuntean@yahoo.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34643374167,,
03/15/2026 6:37am,Pedro Pablo Hoz Herguedas,monikahoz@hotmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34600512777,,
03/15/2026 6:21am,Antonio Burgos,marie_louise@hotmail.es,De pago,SG_ALQUILER-OCT,Correo electrónico,CONTACTADOS,Unassigned,,+34619041942,,
03/15/2026 2:26am,Maricarmen Moreno Martín,maricarmen@puertamatic.es,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34636971491,,
03/14/2026 11:40am,Pablo martinez,Pmenamorado@icloud.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34678446078,,
03/14/2026 8:00am,Mariquita,mariquitacopas@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,CONTACTADOS,Unassigned,,+34648009896,,
03/14/2026 12:54am,Taberna don Juan,tabernadonjuan24@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34615279494,,
03/13/2026 9:13am,Rifeño,mohamed_kharta@hotmail.fr,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34612282794,,
03/13/2026 7:59am,sofiqul islam sohel,sohelazad786@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,CONTACTADOS,Unassigned,,+34668535497,,
03/12/2026 12:20am,Carlos,Chisor79@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34685226900,,
03/09/2026 3:07pm,Juani Tinahones,juanitinah@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34627709567,,
03/09/2026 1:09pm,Jose Fernández,latabernitadefrayluis@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34649031556,,
03/09/2026 8:47am,Carlos Peña,Carlos@solperformance.es,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34607680841,,
03/09/2026 8:33am,Sylvia Caballero Huertas,Nikote7@hotmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34627881290,,
03/09/2026 7:01am,Samuel Moreno Mercado,morenocapilla@hotmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+212606976321,,
03/09/2026 4:34am,Ines De la Rosa Lorenzo,innes8106@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34692041266,,
03/09/2026 4:20am,LIFE COACH Liliana Garderes,Lgarderes.coaching@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34623141291,,
03/08/2026 2:51pm,Juan Torres,jjtp989@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,CONTACTADOS,Unassigned,,+34637123922,,
03/08/2026 12:28pm,Carniceria Juan DEL Pino,dprhuelin134@hotmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34625355549,,
03/07/2026 4:24pm,Fadlo Aandalla,aalallafadlo@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34667344553,,
03/07/2026 2:59pm,Julio Rodriguez,julio@jrodhomes.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,CONTACTADOS,Unassigned,,+34623583638,,
03/07/2026 8:20am,Susana Cornejo Jimenez,scornejojimenez@yahoo.es,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34614335596,,
03/07/2026 7:37am,Ezgi Aktuna,ezgiaktuna8@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,Registrado,Unassigned,,+34622591165,,
03/06/2026 1:02am,José Antonio Ruiz Ortuño,joseantonioruiz1@gmail.com,De pago,SG_ALQUILER-OCT,Correo electrónico,CONTACTADOS,Unassigned,,+34649258876,,
03/05/2026 2:06pm,Joher Hossain,mohammadjahirhossain1346@gmail.com,De pago,SG_Test_Filter_CostadelSol-enero,Correo electrónico,Registrado,Unassigned,,+34611278012,,"""

reader = csv.DictReader(io.StringIO(data))
rows = list(reader)

print(f"TOTAL LEADS: {len(rows)}")
print()

# Date range
dates = []
for r in rows:
    try:
        d = datetime.strptime(r['Creado'].strip(), '%m/%d/%Y %I:%M%p')
        dates.append(d)
    except:
        pass
if dates:
    print(f"RANGO FECHAS: {min(dates).strftime('%d/%m/%Y')} - {max(dates).strftime('%d/%m/%Y')}")
    print(f"DÍAS CON LEADS: {(max(dates)-min(dates)).days} días")
print()

# Status distribution
statuses = Counter(r['Estado'] for r in rows)
print("ESTADOS:")
for s, c in statuses.most_common():
    pct = c/len(rows)*100
    print(f"  {s}: {c} ({pct:.1f}%)")
print()

# Campaigns
forms = Counter(r['Formulario'] for r in rows)
print("CAMPAÑAS (Formulario):")
for f, c in forms.most_common():
    pct = c/len(rows)*100
    print(f"  {f}: {c} ({pct:.1f}%)")
print()

# Duplicate emails
emails = [r['Correo electrónico'].strip().lower() for r in rows]
dup_emails = [e for e, c in Counter(emails).items() if c > 1]
print(f"EMAILS DUPLICADOS: {len(dup_emails)}")
for e in dup_emails:
    names = [r['Nombre'].strip() for r in rows if r['Correo electrónico'].strip().lower() == e]
    print(f"  {e}: {', '.join(names)}")
print()

# Business names (names that look like businesses)
business_keywords = ['bar', 'restaurante', 'cafeteria', 'pub', 'kebab', 'pizzeria', 'carniceria', 'taberna', 'beach', 'club', 'tattoo', 'sport', 'bodegón', 'bodegon', 'hotel', 'peluqueria', 'clinica', 'discoteca', 'showroom', 'eco', 'papeleria', 'panaderia', 'carniceria', 'asesoria', 'inmobiliaria']
business_names = []
for r in rows:
    name = r['Nombre'].strip()
    name_lower = name.lower()
    if any(kw in name_lower for kw in business_keywords):
        business_names.append(name)
print(f"POSIBLES NOMBRES DE NEGOCIOS: {len(business_names)}")
for b in business_names:
    print(f"  {b}")
print()

# Monthly breakdown
monthly = Counter()
for r in rows:
    try:
        d = datetime.strptime(r['Creado'].strip(), '%m/%d/%Y %I:%M%p')
        month_key = d.strftime('%Y-%m')
        monthly[month_key] += 1
    except:
        pass
print("LEADS POR MES:")
for m, c in sorted(monthly.items()):
    print(f"  {m}: {c}")
print()

# Contacted rate
contacted = sum(1 for r in rows if r['Estado'] in ('CONTACTADOS',))
not_contacted = len(rows) - contacted
print(f"CONTACTADOS: {contacted} / NO CONTACTADOS: {not_contacted}")
print(f"TASA CONTACTACIÓN: {contacted/len(rows)*100:.1f}%")
print()

# Campaigns by month
print("LEADS POR CAMPAÑA Y MES:")
campaigns_forms = list(forms.keys())
for cf in campaigns_forms:
    monthly_cf = Counter()
    for r in rows:
        if r['Formulario'] == cf:
            try:
                d = datetime.strptime(r['Creado'].strip(), '%m/%d/%Y %I:%M%p')
                monthly_cf[d.strftime('%Y-%m')] += 1
            except:
                pass
    months = sorted(monthly_cf.keys())
    total = sum(monthly_cf.values())
    print(f"\n  {cf} (total: {total}):")
    for m in months:
        print(f"    {m}: {monthly_cf[m]}")
