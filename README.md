## Le principe de Github:

Github heberge notre travail sur un repository (repo), une sorte de serveur de stockage.

Ce repo est divise en plusieurs branches qui permettre de separer nos travails.

Imagines ce repo comme un livre dont nous sommes co-auteurs.
Ou la branche appelee "main" est la version publiee et visible de tout le monde sur le serveur Vercel.

Les autres branches sont des brouillons, ils ont une copie de la branche main et tu peux travailler dessus, modifier, supprimer des choses sans alterer la version du serveur Vercel.

## Workflow

### 1. Clone du repo
Pour pouvoir travailler sur le projet stocke sur Github tu dois ```cloner``` le repo sur ton PC. Cela n'est a faire qu'une seule fois.

Pour cloner le repo, tu ouvres ton terminal, tu te rends avec ton terminal dans un dossier ou tu veux travailler. 

Ensuite tu lances cette commande:
```git clone https://github.com/agasnier/Start-Scale.git Start-Scale```

Cela te creer un dossier ```Start-Scale``` avec un fichier ```.git``` qui detient toutes les informations de communication avec Github. Il ne faut pas le supprimer.

### 2. Se mettre a jour
Avant de commencer a travailler, il faut verifier que tu fais une copie de la derniere version en ligne.

TOUTES LES COMMANDES QUI SUIVENT SE FERONT A LA RACINE DU DOSSIER ```Start-Scale```

Une fois dans le dossier Start-Scale avec le terminal
```git switch main```
```git pull origin main```

### 3. Creer son espace de travail
Une fois que tu as la derniere version du travail, tu dois aller sur ton espace de travail.

```git switch Noah```

### 4. Enregistrer son travail sur Github
Une fois que tu as fait des modification sur ton travail, ces modifications sont enregistres que sur ton PC. Tu dois les envoyers sur le Github pour que je puisse lie nos travails proprement.

Tu ouvres une fenetre de la console, tu te rends dans le dossier ou se trouve le ```.git``` et ton travail.

Tu lances la commande: ```git add .```
Cela prepare les fichiers a etre envoyes.

Ensuite: ```git commit -m "explication de ce que tu as fait"```

C'est important que tu mettes un bons message pour que tu expliques succintement ce que tu as fait (ex: "Ajout du bouton contact" plutôt que "modif"). C'est la cles pour bosser a plusieurs, si le message est comprehensible je n'aurais pas besoin de te contacter pour comprendre.

Enfin tu envois ton travail en ligne sur ta branche brouillon: ```git push origin Noah```

Je m'occupe de faire la transition entre le brouillon et la mise en ligne pour le moment. Je te montrerai pour que tu saches faire ensuite.