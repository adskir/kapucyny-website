# Капуцыны ў Беларусі — новы сайт

Статычны сайт на **11ty (Eleventy)** з адміністрацыйнай панэллю на **Decap CMS**, які хостыцца на **Netlify**.

## Што ўнутры

- `src/` — увесь зыходны код і кантэнт сайта
  - `src/lokacyi/` — 7 старонак лакацый (Мінск, Маладзечна, Докшыцы, Ліпнішкі, Смалявічы, Вільнюс, Варонеж)
  - `src/novosti/` — навіны
  - `src/bibliyateka/` — тэксты бібліятэкі (малітвы, Правіла, Рэгула, гісторыя)
  - `src/_data/settings.yml` — кантакты, сацсеткі, WhatsApp (адзінае месца праўкі для ўсяго сайта)
  - `src/_data/braty.yml` — спіс братоў, якія служаць у Беларусі
  - `src/css/style.css` — уся дызайн-сістэма
- `admin/` — адміністрацыйная панэль (Decap CMS)
- `netlify.toml` — канфігурацыя білду і бяспекі

## Як задэплоіць (пакрокава)

### 1. Загрузі праект на GitHub
1. Стварыце новы рэпазіторый на [github.com](https://github.com) (напрыклад `kaptsyny-sajt`)
2. У тэрмінале, у папцы праекта:
   ```
   git init
   git add .
   git commit -m "Пачатковая версія сайта"
   git branch -M main
   git remote add origin https://github.com/ВАШ-ЛОГІН/kaptsyny-sajt.git
   git push -u origin main
   ```

### 2. Падключы Netlify
1. Зайдзіце на [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Абярыце GitHub і свой рэпазіторый
3. Netlify сам падхопіць налады з `netlify.toml` (build command і publish folder ужо прапісаныя)
4. Націсніце **Deploy**

### 3. Уключы Identity і Git Gateway (для працы адмін-панэлі)
1. У панэлі Netlify: **Site configuration → Identity → Enable Identity**
2. Там жа: **Registration → Invite only** (каб чужыя людзі не маглі самі зарэгістравацца)
3. **Identity → Services → Git Gateway → Enable Git Gateway**
4. **Identity → Invite users** — увядзіце email чалавека, які будзе рэдагаваць сайт (напрыклад брата-адказнага)

### 4. Правер адмін-панэль
Зайдзіце на `https://ваш-сайт.netlify.app/admin/` — павінна з'явіцца форма ўваходу праз Identity. Пасля запрашэння на email прыйдзе спасылка для ўстаноўкі пароля.

## Што трэба даробіць пасля дэплою

- [ ] **Пацвердзіць тэлефон Докшыц** — у зыходных скрынах ён адрозніваўся (5-62-18 на старонцы лакацыі і 2-19-59 на старонцы кантактаў); пастаўлены першы варыянт з пазнакай TODO ў файле `src/lokacyi/dokshytsy.md`
- [ ] **Дадаць рэальнае лога** — зараз выкарыстоўваецца часовая SVG-заглушка (`src/images/logo-white.svg`, `src/images/favicon.svg`); замяні на арыгінальны Tau-крыж/саву з брэнда
- [ ] **Загрузіць рэальныя фота** для ўсіх старонак (зараз усе спасылкі на выявы пустыя — `/images/uploads/...`) праз CMS
- [ ] **Google Maps embed** — уставіць спасылку ў `src/_data/settings.yml` → `curia.map_embed_url` (Google Maps → Share → Embed a map → скапіяваць `src` з iframe)
- [ ] **Спасылка WhatsApp-групы** — `src/_data/settings.yml` → `whatsapp_url`
- [ ] **Тэкст пра благаслаўлёнага Ганарата Казьмінскага** — старонка `/blaslauleny-ganarat-kazminski/` зараз пустая-заглушка
- [ ] **Галерэя** — структура альбомаў яшчэ не спраектаваная, чакае рэальных фота і рашэння як іх групаваць
- [ ] **Спіс братоў** — праверыць, ці поўны (сабраны з 2 старонак скрыншотаў, магла закрасціся памылка)
- [ ] Праверыць нумары тэлефонаў/адрасы ўсіх лакацый яшчэ раз

## Лакальная распрацоўка

```
npm install
npx @11ty/eleventy --serve
```
Сайт будзе даступны на `http://localhost:8080`.
