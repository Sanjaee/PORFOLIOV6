import { Tile } from "../Tiles/Tile";
import TileBackground from "../Tiles/TileBackground";
import { TileContent } from "../Tiles/TileContent";
import TileWrapper from "../Tiles/TileWrapper";
import { WorkBackground } from "../WorkComponents/WorkBackground";
import WorkContent from "../WorkComponents/WorkContent";
import { workTiles } from "../WorkComponents/workTiles";

export default function Works() {
  return (
    <TileWrapper numOfPages={workTiles.length}>
      <TileBackground>
        <WorkBackground />
      </TileBackground>
      <TileContent>
        {workTiles.map((work, i) => (
          <Tile page={i} key={work.title}>
            <WorkContent work={work} />
          </Tile>
        ))}
      </TileContent>
    </TileWrapper>
  );
}
