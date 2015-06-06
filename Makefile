ROOTDIR:=.
SRCDIR:=src
TARGETDIR:=dist
BCOMMENT=sed '1 s%^%/* %;2,$$ s%^% * %;$$ s%$$%'$$'\\\n */%'
DEDUP=sed '/^[[:space:]]*$$/ s/^[[:space:]]*$$//' | cat -s

CFLAGS=-P -undef -Wundef -std=c99 -nostdinc++ -Wtrigraphs -Wno-invalid-pp-token -fdollars-in-identifiers
FORMAT=js-beautify -s 3 -f -
VALIDATE=esvalidate

all: propene.js

propene.js: accessor.js binding.js observecfg.js observer.js
	cat ${ROOTDIR}/LICENSE |  ${BCOMMENT} > ${TARGETDIR}/propene.js
	echo '\n' >> ${TARGETDIR}/propene.js
	cpp ${CFLAGS} -I${SRCDIR} < ${SRCDIR}/propene.js.cpp | ${DEDUP} | ${FORMAT} >> ${TARGETDIR}/propene.js

%.js:
		${VALIDATE} ${SRCDIR}/$@
