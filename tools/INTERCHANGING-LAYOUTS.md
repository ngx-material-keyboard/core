# Interchanging layouts

## Requirements (or good to know)
When talking about keboard layouts it is hard to find a beginning, but it's even harder to find an end. Just keep in mind that most 
layouts have been developed for typewriters. And since we do not have enough space to show all (even most of the time irrelevant) signs, 
keys can have several meanings. Thus we have special keys like [`modifiers`][modifier] and [`dead keys`][dead key].

Some modifiers can be called by a combination of other keys, like [`AltGraph` means `Control`+`Alt`][AltGraph].

On macOS the `Alt` key is called `Option` key and `Command` means `Control`.

## Windows
> Microsoft provides a really useful tool to manipulate and create keyboard layouts. Not only new layouts can be created, it allows you 
to export the default layouts as well. It's called [MKLC (Microsoft Keyboard Layout Creator)][MKLC].

The default format for keyboard layouts on windows is `*.klc`. This format is as ugly as it's hideous - meta informations are mixed with 
csv-like data (but instead of comma seperators tabs are used). But basically it provides the key maps for five different indices:
1. normal character
2. `Shift`
3. `Control`
4. `Control`+`Alt`
5. `Shift`+`Control`+`Alt`

## MacOS
> On macOS are two major tools for creating and modifying keyboard layouts: [Ukelele] and [Karabiner].

On macOS keyboard layouts are stored in `/Library/Keyboard Layouts` as `*.keylayout`. This format is XML based and really 
self-explanatory. It provides the different mappings as indices, too, but the meaning of the inidices is not uniform like on 
windows but dynamically associated by a special so-called `keyMapSet`.

[MKLC]: https://www.microsoft.com/globaldev/tools/msklc.mspx
[Ukelele]: https://www.microsoft.com/globaldev/tools/msklc.mspx
[Karabiner]: https://pqrs.org/osx/karabiner/
[modifier]: https://en.wikipedia.org/wiki/Modifier_key
[dead key]: https://en.wikipedia.org/wiki/Dead_key
[AltGraph]: https://en.wikipedia.org/wiki/AltGr_key#Control_.2B_Alt_as_a_substitute
