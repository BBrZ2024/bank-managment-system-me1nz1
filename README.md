# Aufgabenstellung: Bankmanagementsystem

### Entwickle ein Bankmanagementsystem, das die Verwaltung von Bankkonten und Mitarbeitern ermöglicht.
* Das System soll verschiedene Transaktionen wie: 
  * Einzahlungen, 
  * Abhebungen 
  * und Überweisungen unterstützen.


* Denke an die OOP Prinzipien, überlege gut welche Klassen zum Implementieren sind und welche nicht.


* Denke an die Design Prinziples.


### Requierments:
* Erlaubt sind alle Programmiersprachen --> (Bitte dabei bedenken das Feedback bei mir nur auf, Java, Javascript, Python)


* UML diagramm verwende die im Unterricht besprochen Software oder eine eigene
  * https://draw.io/
  * Denke an:

    * Aggreagation
    * Association
    * Dependency
    * Composition
  * Richtige bezeichnung Informationen über UML 
    * https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/
  


* Erstelle die Software laut deinem erstellten UML


**Weiter details werden in der Aufgabenstellung nicht stehen,
das ist gewollt so du musst selber überlgen wie du das angehen sollst!**

* Beispiel Bankklasse (das ist meine verwendete Klasse, du kannst diese Klasse als Leitfaden benutzen aber du kannst auch gerne eine eigen erstellen) : 

@startuml
class Bank {
-name: string
-location: string
-accounts: Account[]
-employees: Employee[]
+Bank(name: string, location: string)
+addAccount(account: Account): void
+removeAccount(accountNumber: string): void
+getAccount(accountNumber: string): Account
+getAllAccounts(): Account[]
+addEmployee(employee: Employee): void
+removeEmployee(employeeId: string): void
+getAllEmployees(): Employee[]
}
@enduml



